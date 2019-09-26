const firehoseUtils = require("./utils/firehose_utils");
const awsUtils = require("./utils/aws_utils");
const generalUtils = require("./utils/general_utils");

const STREAM_NAME = "test-firehose-log-stream";

exports.log = async function(records, programaticError=null) {
	let extracted_records = awsUtils.extractAwsLogEvent(records);
	let filteredRecords = generalUtils.filterRecords(extracted_records, programaticError);
	let firehoseRecords = generalUtils.convertToLumigoRecords(filteredRecords);
	let firehose = new firehoseUtils.Firehose(STREAM_NAME);
	return await firehose.putRecordsBatch(firehoseRecords);
};