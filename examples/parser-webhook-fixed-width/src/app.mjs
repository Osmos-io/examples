import path from "path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { FixedWidthParser } from "fixed-width-parser";

const PROTO_PATH = path.join(process.cwd(), "protos", "parser.proto");

const PACKAGE_DEFINITION = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const PARSER_WEBHOOKS_PROTO =
  grpc.loadPackageDefinition(PACKAGE_DEFINITION).osmos.parser.v1;

/**
 * parseFileToTable This request attempts to parse a sequence of bytes as a CSV.
 * This is then transmogrified into our protobuf response and sent back.
 * Any error or failure to do so will result in an error gRPC response.
 *
 * @param {parser.v1.ParseFileToTableRequest} parseFileToTableRequest The request from the client
 * @returns {response} ParseFileToTableResponse The parsed response to the client
 */
function parseFileToTable(call, callback) {
  try {
    const { data: rawData } = call.request;

    // here we convert the byte stream into a string and remove the first line since that is just our headers
    // we also remove any empty lines (usuall found at the end of the file)
    const data = rawData
      .toString()
      .split("\n")
      .slice(1)
      .filter((row) => row !== "")
      .join("\n");

    // here we parse the string sent as a fixed width file
    const parsingOptions = [
      {
        type: "string",
        name: "name",
        start: 0,
        width: 20,
      },
      {
        type: "string",
        name: "email",
        start: 20,
        width: 25,
      },
      {
        type: "string",
        name: "food",
        start: 45,
        width: 15,
      },
    ];

    const fixedWidthParser = new FixedWidthParser(parsingOptions);

    const rows = fixedWidthParser.parse(data).map((result) => ({
      // here we trim an extra whitespace off the end of the parsed string
      values: Object.values(result).map((value) => value.trim()),
    }));

    const headers = parsingOptions.map((field) => field.name);

    // Manipulate rows here
    let response = {
      headers,
      rows,
    };

    callback(null, response);
  } catch (e) {
    return callback({
      message: e,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}

const server = new grpc.Server();

// Add any services and their respective endpoints here
server.addService(PARSER_WEBHOOKS_PROTO.Parser.service, {
  parseFileToTable,
});

// Start up the server and begin handling requests
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err !== null) {
      console.error("[ERROR] server failed to start", err);
      process.exit(1);
    }

    console.info(`[INFO] server starting on ${port}`);
    server.start();
  }
);
