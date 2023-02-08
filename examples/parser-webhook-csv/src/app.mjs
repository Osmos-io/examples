import path from "path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import Papa from "papaparse";

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

    // Papaparse does not handle buffers directly so we need to turn this back into a JS string type
    const data = rawData.toString();

    // here we parse the string sent as a CSV
    const parsingResults = Papa.parse(data, {
      skipEmptyLines: true,
      header: true,
    });

    const headers = parsingResults.meta.fields;

    // map our results into the expected response struct
    const rows = parsingResults.data.map((row) => ({
      values: Object.values(row),
    }));

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
