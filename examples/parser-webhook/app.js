
var PROTO_PATH = __dirname + '/parser.proto';

// var fs = require('fs');
// var parseArgs = require('minimist');
// var path = require('path');
// var _ = require('lodash');
var csvParse = require('csv-parse/sync');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var parserWebhookProto = grpc.loadPackageDefinition(packageDefinition).osmos.parser.v1;


/**
 * parseFileToTable request handler. 
 * @param {parseFileToTableRequest} ParseFileToTableRequest The request from the client
 * @returns {response} ParseFileToTableResponse The parsed response to the client
 */
function parse(parseFileToTableRequest) {
    // console.log('Request!');
    const data = parseFileToTableRequest.data;
    // console.log(stringData);

    // Do things with the string here, parse and return.
    // Example code here assumes string is a CSV
    const records = csvParse.parse(data, {
        columns: true,
        skip_empty_lines: true
    });

    var headers = [];
    for (record_prop in records[0]) {
        if (Object.prototype.hasOwnProperty.call(records[0], record_prop)) {
            headers.push(record_prop);
        }
    }

    const rows = records.map((row) => {
        let row_value = [];
        for (row_prop in row) {
            if (Object.prototype.hasOwnProperty.call(row, row_prop)) {
                row_value.push(row[row_prop]);
            }
        }
        return {
            'value': row_value
        }
    });

    // Manipulate rows here

    let response = {
        'headers': headers,
        'rows': rows
    }
    return response;

}

function parseFileToTable(call, callback) {
    callback(null, parse(call.request));
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
    var server = new grpc.Server();
    server.addService(parserWebhookProto.Parser.service, {
        parseFileToTable: parseFileToTable,
    });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
}

main();
