import { FirehoseClient } from "./utils/firehoseClient";
import { extractAwsLogEvent } from "./utils/awsUtils";
import { filterMessagesFromRecord } from "./utils/generalUtils";
import { getStreamName } from "./utils/consts";
import { logDebug } from "./utils/logger";

export const shipLogs = async function(
	record: any,
	programaticError?: string
): Promise<number> {
	try {
		const streamName = getStreamName();
		const extractedRecord = extractAwsLogEvent(record);
		logDebug(
			`Got ${extractedRecord.logEvents.length} log events from ${extractedRecord.logGroup}`
		);
		let filteredRecord = filterMessagesFromRecord(extractedRecord, programaticError);
		if (filteredRecord.logEvents.length > 0) {
			logDebug(`About to send ${extractedRecord.logEvents.length} events`, {
				streamName
			});
			let firehose = new FirehoseClient(streamName, filteredRecord.owner);
			return await firehose.putRecordsBatch([filteredRecord]);
		}
	} catch (e) {
		// couldn't ship logs
		logDebug("Got an error from shipper", e);
	}
	return 0;
};
