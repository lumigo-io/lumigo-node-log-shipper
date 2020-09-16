import { getFunctionArn } from "./awsUtils";

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

export const convertToLumigoRecords = function(awsLogEvent: any) {
	let records: any = [];
	let functionArn = getFunctionArn(awsLogEvent);
	let owner: any;
	if (awsLogEvent.hasOwnProperty("owner")) {
		owner = awsLogEvent["owner"];
	}
	if (
		awsLogEvent.hasOwnProperty("logEvents") &&
		Array.isArray(awsLogEvent["logEvents"])
	) {
		awsLogEvent["logEvents"].forEach(function(event) {
			let convertedEvent = {
				message: event["message"],
				timestamp: event["timestamp"],
				event_details: {
					timestamp: event["timestamp"],
					aws_account_id: owner,
					function_details: {
						resource_id: functionArn,
						memory: 0 // We cant get memory of the running function from the log-shipper function
					}
				}
			};
			records.push(convertedEvent);
		});
	}
	return records;
};

export const isValidEvent = function(record: any): boolean {
	for (let i = 0; i < FILTER_KEYWORDS.length; i++) {
		if (record["message"].includes(FILTER_KEYWORDS[i])) {
			return true;
		}
	}
	return false;
};

export const filterRecords = function(records: any, programaticError?: any): any {
	if (programaticError != null) {
		FILTER_KEYWORDS.push(programaticError);
	}
	// @ts-ignore
	records["logEvents"] = records["logEvents"].filter(event => {
		return isValidEvent(event);
	});
	return records;
};
