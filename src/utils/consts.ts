const runOnAws = !!process.env.AWS_EXECUTION_ENV;
const CURRENT_ENV = runOnAws ? process.env.ENV : process.env.USER;

export let TARGET_ENV: string = process.env.TARGET_ENV ? process.env.TARGET_ENV : "prod";
if (TARGET_ENV === "SELF" && CURRENT_ENV) TARGET_ENV = CURRENT_ENV;
export const TARGET_ACCOUNT_ID = process.env.TARGET_ACCOUNT_ID || "114300393969";
export const SELF_ACCOUNT_ID = "SELF";

export const isSendingLogsToMyself = (): boolean => TARGET_ACCOUNT_ID === SELF_ACCOUNT_ID;

export const getStreamName = (): string => {
	const targetEnv = isSendingLogsToMyself() ? CURRENT_ENV : TARGET_ENV;
	return `${targetEnv}_logs-edge-stfl_customer-logs-firehose`;
};
