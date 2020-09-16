"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRecords = exports.isValidEvent = exports.convertToLumigoRecords = void 0;
var awsUtils_1 = require("./awsUtils");
var FILTER_KEYWORDS = [
    "Task timed out",
    "Process exited before completing request",
    "REPORT RequestId",
];
exports.convertToLumigoRecords = function (awsLogEvent) {
    var records = [];
    var functionArn = awsUtils_1.getFunctionArn(awsLogEvent);
    var owner;
    if (awsLogEvent.hasOwnProperty("owner")) {
        owner = awsLogEvent["owner"];
    }
    if (awsLogEvent.hasOwnProperty("logEvents") && Array.isArray(awsLogEvent["logEvents"])) {
        awsLogEvent["logEvents"].forEach(function (event) {
            var convertedEvent = {
                "message": event["message"],
                "timestamp": event["timestamp"],
                "event_details": {
                    "timestamp": event["timestamp"],
                    "aws_account_id": owner,
                    "function_details": {
                        "resource_id": functionArn,
                        "memory": 0
                    }
                }
            };
            records.push(convertedEvent);
        });
    }
    return records;
};
exports.isValidEvent = function (record) {
    for (var i = 0; i < FILTER_KEYWORDS.length; i++) {
        if (record["message"].includes(FILTER_KEYWORDS[i])) {
            return true;
        }
    }
    return false;
};
exports.filterRecords = function (records, programaticError) {
    if (programaticError != null) {
        FILTER_KEYWORDS.push(programaticError);
    }
    records["logEvents"] = records["logEvents"].filter(function (event) {
        return exports.isValidEvent(event);
    });
    return records;
};
//# sourceMappingURL=generalUtils.js.map