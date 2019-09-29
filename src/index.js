const firehoseUtils = require("./utils/firehose_utils");
const awsUtils = require("./utils/aws_utils");
const generalUtils = require("./utils/general_utils");
const consts = require("./utils/consts");

exports.shipLogs = async function(records, programaticError=null) {
	let extracted_records = awsUtils.extractAwsLogEvent(records);
	let filteredRecords = generalUtils.filterRecords(extracted_records, programaticError);
	let firehoseRecords = generalUtils.convertToLumigoRecords(filteredRecords);
	if (firehoseRecords.length > 0) {
		let accountId = firehoseRecords[0]["event_details"]["aws_account_id"];
		let firehose = new firehoseUtils.Firehose(consts.STREAM_NAME, accountId);
		let result = 0;
		try {
			await firehose.getFirehoseClient(async function (){
				result = await firehose.putRecordsBatch(firehoseRecords);
			});
			return result;
		} catch (e) {
			// couldn't ship logs
		}
	}
	return 0;
};