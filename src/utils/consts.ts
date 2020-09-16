const runOnAws = process.env.AWS_EXECUTION_ENV === "true";
const ENV = runOnAws ? process.env.ENV : process.env.USER;

let TARGET_ENV = process.env.TARGET_ENV;
if (TARGET_ENV === undefined || TARGET_ENV === "") {
	TARGET_ENV = "prod";
}

if (TARGET_ENV === "SELF") TARGET_ENV = ENV;

export const STREAM_NAME = `${TARGET_ENV}_logs-edge-stfl_customer-logs-firehose`;
