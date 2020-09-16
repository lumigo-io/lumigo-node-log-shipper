"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STREAM_NAME = void 0;
var ENV;
if (process.env.AWS_EXECUTION_ENV === "true") {
    ENV = process.env.ENV;
}
else {
    ENV = process.env.USER;
}
var TARGET_ENV = process.env.TARGET_ENV;
if (TARGET_ENV === undefined || TARGET_ENV === "") {
    TARGET_ENV = "prod";
}
if (TARGET_ENV === "SELF")
    TARGET_ENV = ENV;
exports.STREAM_NAME = TARGET_ENV + "_logs-edge-stfl_customer-logs-firehose";
//# sourceMappingURL=consts.js.map