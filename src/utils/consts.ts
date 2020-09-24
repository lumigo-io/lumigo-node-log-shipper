const runOnAws = !!process.env.AWS_EXECUTION_ENV;
const ENV = runOnAws ? process.env.ENV : process.env.USER;

export let TARGET_ENV: string = process.env.TARGET_ENV ? process.env.TARGET_ENV : "prod";
if (TARGET_ENV === "SELF" && ENV) TARGET_ENV = ENV;
export const TARGET_ACCOUNT_ID = process.env.TARGET_ACCOUNT_ID || "114300393969";
export const SELF_ACCOUNT_ID = "SELF";

export const getStreamName = () => {
	const env = TARGET_ENV === "SELF" && ENV ? ENV : TARGET_ENV;
	return `${env}_logs-edge-stfl_customer-logs-firehose`;
};
