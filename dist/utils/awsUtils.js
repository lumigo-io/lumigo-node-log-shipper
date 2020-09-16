"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionArn = exports.getCurrentRegion = exports.extractAwsLogEvent = void 0;
var buffer_1 = require("buffer");
var zlib_1 = require("zlib");
exports.extractAwsLogEvent = function (event) {
    var decodedData = buffer_1.Buffer.from(event["awslogs"]["data"], "base64").toString("base64");
    var decompressedData = zlib_1.gunzipSync(buffer_1.Buffer.from(decodedData, "base64")).toString("utf-8");
    return JSON.parse(decompressedData);
};
exports.getCurrentRegion = function () {
    return process.env.AWS_REGION || "us-west-2";
};
exports.getFunctionArn = function (awsLogEvent) {
    var region = exports.getCurrentRegion();
    if (awsLogEvent.hasOwnProperty("logGroup")) {
        var functionName = awsLogEvent["logGroup"].split("/")[3];
        return "arn:aws:lambda:" + region + ":" + awsLogEvent.owner + ":function:" + functionName;
    }
    return null;
};
//# sourceMappingURL=awsUtils.js.map