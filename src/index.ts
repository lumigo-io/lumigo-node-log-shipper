import { FirehoseClient } from "./utils/firehoseClient";
import { extractAwsLogEvent } from "./utils/awsUtils";
import { filterMessagesFromRecord } from "./utils/generalUtils";
import { STREAM_NAME } from "./utils/consts";

export const shipLogs = async function(
	record: any,
	programaticError?: string
): Promise<number> {
	try {
		const extractedRecord = extractAwsLogEvent(record);
		let filteredRecord = filterMessagesFromRecord(extractedRecord, programaticError);
		if (filteredRecord.logEvents.length > 0) {
			let firehose = new FirehoseClient(STREAM_NAME, filteredRecord.owner);
			return await firehose.putRecordsBatch([filteredRecord]);
		}
	} catch (e) {
		// couldn't ship logs
	}
	return 0;
};
