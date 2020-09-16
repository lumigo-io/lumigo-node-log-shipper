import { AwsLogEvent, AwsLogSubscriptionEvent } from "../types/awsTypes";

let FILTER_KEYWORDS = [
	"Task timed out",
	"Process exited before completing request",
	"REPORT RequestId",
	"[ERROR]",
	"[LUMIGO_LOG]",
	"@lumigo",
	"LambdaRuntimeClientError",
	"Invoke Error",
	"Uncaught Exception",
	"Unhandled Promise Rejection"
];

export const isValidEvent = function(record: AwsLogEvent): boolean {
	return FILTER_KEYWORDS.some(filterWord => record.message.includes(filterWord));
};

export const filterMessagesFromRecord = function(
	record: AwsLogSubscriptionEvent,
	programaticError?: string
): AwsLogSubscriptionEvent {
	programaticError && FILTER_KEYWORDS.push(programaticError);
	record.logEvents = record.logEvents.filter(isValidEvent);
	return record;
};
