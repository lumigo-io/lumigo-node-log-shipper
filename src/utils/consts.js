let ENV;
if (process.env.AWS_EXECUTION_ENV === "true") {
	ENV = process.env.ENV;
} else {
	ENV = process.env.USER;
}
let TARGET_ENV = process.env.TARGET_ENV;
if (TARGET_ENV === undefined || TARGET_ENV === "") {
	TARGET_ENV = "prod";
}

if (TARGET_ENV === "SELF")
	TARGET_ENV = ENV;

let STREAM_NAME = `${TARGET_ENV}_logs-edge-stfl_customer-logs-firehose`;

module.exports = {STREAM_NAME};