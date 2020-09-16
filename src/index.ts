import { FirehoseClient } from "./utils/firehoseClient";
import { extractAwsLogEvent } from "./utils/awsUtils";
import { filterRecords, convertToLumigoRecords } from "./utils/generalUtils";
import { STREAM_NAME } from "./utils/consts";

export const shipLogs = async function(
	records: any,
	programaticError: any = null
): Promise<number> {
	try {
		let extracted_records = extractAwsLogEvent(records);
		let filteredRecords = filterRecords(extracted_records, programaticError);
		let firehoseRecords = convertToLumigoRecords(filteredRecords);
		if (firehoseRecords.length > 0) {
			let accountId = firehoseRecords[0]["event_details"]["aws_account_id"];
			let firehose = new FirehoseClient(STREAM_NAME, accountId);
			return await firehose.putRecordsBatch(firehoseRecords);
		}
	} catch (e) {
		// couldn't ship logs
	}
	return 0;
};
