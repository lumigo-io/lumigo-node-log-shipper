const AWS = require("aws-sdk");
const REGION = process.env.AWS_REGION || "us-west-2";
const ALLOW_RETRY_ERROR_CODES = ["ServiceUnavailableException", "InternalFailure"];
const stsUtils = require("../utils/sts_utils");

const MAX_RETRY_COUNT = 3;
const MAX_ITEM_SIZE = 1048576;
const MAX_FIREHOSE_BATCH_SIZE = 250;

module.exports = {
	Firehose: class {
		constructor(streamName, accountId) {
			this.streamName = streamName;
			this.accountId = accountId;
			AWS.config.update({region: REGION});
		}

		async getFirehoseClient(callback) {
			try {
				let stsResponse = await stsUtils.assumeRole(this.accountId);
				this.firehose = new AWS.Firehose({
					"region": REGION,
					"accessKeyId": stsResponse.Credentials.AccessKeyId,
					"secretAccessKey": stsResponse.Credentials.SecretAccessKey,
					"sessionToken": stsResponse.Credentials.SessionToken
				});
			} catch (e) {
				throw e;
			}
			await callback();
		}

		async putRecordsBatch(records) {
			let recordsToWrite = [];
			let numberOfRecords = 0;
			let rawEvents = records;

			while (rawEvents.length > 0) {
				let event = rawEvents.pop();
				if (!this.validFirehoseEvent(event)) {
					// event is too big
					continue;
				}
				recordsToWrite.push(event);
				if (rawEvents.length === 0 || recordsToWrite.length === MAX_FIREHOSE_BATCH_SIZE) {
					let retryCounter = 0;
					while (retryCounter < MAX_RETRY_COUNT) {
						try {
							let response = await this.pushToFirehose(this.convertToFirehoseEvents(recordsToWrite), this.streamName);
							numberOfRecords += recordsToWrite.length - response["FailedPutCount"];
							if (response["FailedPutCount"] === 0){
								break;
							}
							let retryItems = this.parseFirehoseProblematicRecords(response["RequestResponses"]);
							recordsToWrite = this.handleRetryItems(recordsToWrite, retryItems);
							retryCounter++;
						} catch (ex) {
							retryCounter++;
						}
					}
					recordsToWrite = [];
				}
			}
			return numberOfRecords;
		}

		validFirehoseEvent(event) {
			let eventSize = JSON.stringify(event).length;
			return eventSize < MAX_ITEM_SIZE;
		}

		pushToFirehose(records, streamName) {
			let _this = this;
			return new Promise(function(resolve, reject) {
				let params = {
				  DeliveryStreamName: streamName,
				  Records: records,
				};
				_this.firehose.putRecordBatch(params, function(err, data) {
				  if (err) {
						reject(err);
				  }
				  else {
						resolve(data);
				  }
				});
			});
		}

		convertToFirehoseEvents(events) {
			let firehoseRecords = [];
			events.forEach(function (event) {
				try {
					let eventAsString = JSON.stringify(event);
					if (eventAsString != null) {
						eventAsString += ",";
						firehoseRecords.push({"Data": eventAsString});
					}
				} catch (ex) {
					// failed to convert record
				}
			});
			return firehoseRecords;
		}

		handleRetryItems(allRecords, retryItems) {
			let retryBatch = [];
			retryItems.forEach(function(item) {
				retryBatch.push(allRecords[item]);
			});
			return retryBatch;
		}

		parseFirehoseProblematicRecords(records) {
			let retryItems = [];
			records.forEach(function (record, index) {
				if (record.hasOwnProperty("ErrorCode")) {
					if (ALLOW_RETRY_ERROR_CODES.includes(record["ErrorCode"])) {
						retryItems.push(index);
					}
				}
			});
			return retryItems;
		}
	},
};