import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk/lib/error";

import AWS from "aws-sdk";
import { assumeRole } from "./stsUtils";
import { getCurrentRegion } from "./awsUtils";
import { AwsLogSubscriptionEvent } from "../types/awsTypes";

const ALLOW_RETRY_ERROR_CODES = ["ServiceUnavailableException", "InternalFailure"];

const MAX_RETRY_COUNT = 3;
const MAX_ITEM_SIZE = 1048576;
const MAX_FIREHOSE_BATCH_SIZE = 250;

const getItemMaxSize = (): number => {
	if (process.env.LUMIGO_ITEM_MAX_SIZE) {
		return parseInt(process.env.LUMIGO_ITEM_MAX_SIZE);
	}
	return MAX_ITEM_SIZE;
};

export class FirehoseClient {
	private readonly streamName: string;
	private readonly accountId: string;
	private firehose?: AWS.Firehose;

	constructor(streamName: string, accountId: string) {
		this.streamName = streamName;
		this.accountId = accountId;
	}

	private async getFirehoseClient(): Promise<AWS.Firehose> {
		const stsResponse = await assumeRole(this.accountId);
		if (!stsResponse.Credentials) throw Error("AssumeRoleFailed");
		const region = getCurrentRegion();
		return new AWS.Firehose({
			region: region,
			accessKeyId: stsResponse.Credentials.AccessKeyId,
			secretAccessKey: stsResponse.Credentials.SecretAccessKey,
			sessionToken: stsResponse.Credentials.SessionToken
		});
	}

	async putRecordsBatch(records: AwsLogSubscriptionEvent[]) {
		const itemMaxSize = getItemMaxSize();
		let recordsToWrite = [];
		let numberOfRecords = 0;
		let rawEvents = records;

		while (rawEvents.length > 0) {
			let event = rawEvents.pop();
			if (!this.validFirehoseEvent(event, itemMaxSize)) {
				// event is too big
				continue;
			}
			recordsToWrite.push(event);
			if (
				rawEvents.length === 0 ||
				recordsToWrite.length === MAX_FIREHOSE_BATCH_SIZE
			) {
				let retryCounter = 0;
				while (retryCounter < MAX_RETRY_COUNT) {
					try {
						let response = await this.pushToFirehose(
							this.convertToFirehoseEvents(recordsToWrite),
							this.streamName
						);
						numberOfRecords +=
							recordsToWrite.length - response["FailedPutCount"];
						if (response["FailedPutCount"] === 0) {
							break;
						}
						let retryItems = this.parseFirehoseProblematicRecords(
							response["RequestResponses"]
						);
						recordsToWrite = this.handleRetryItems(
							recordsToWrite,
							retryItems
						);
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

	validFirehoseEvent(event: any, maxSize: number): boolean {
		let eventSize = JSON.stringify(event).length;
		return eventSize < maxSize;
	}

	async pushToFirehose(
		records: any,
		streamName: any
	): Promise<PromiseResult<AWS.Firehose.Types.PutRecordBatchOutput, AWSError>> {
		let params = {
			DeliveryStreamName: streamName,
			Records: records
		};
		if (!this.firehose) {
			this.firehose = await this.getFirehoseClient();
		}
		return await this.firehose.putRecordBatch(params).promise();
	}

	convertToFirehoseEvents(events: any[]): any[] {
		let firehoseRecords: any[] = [];
		events.forEach(function(event) {
			try {
				let eventAsString = JSON.stringify(event);
				if (eventAsString != null) {
					eventAsString += ",";
					firehoseRecords.push({ Data: eventAsString });
				}
			} catch (ex) {
				// failed to convert record
			}
		});
		return firehoseRecords;
	}

	handleRetryItems(allRecords: any[], retryItems: any[]): any[] {
		let retryBatch: any[] = [];
		retryItems.forEach(function(item) {
			retryBatch.push(allRecords[item]);
		});
		return retryBatch;
	}

	parseFirehoseProblematicRecords(records: any[]) {
		let retryItems: any[] = [];
		records.forEach(function(record, index) {
			if (record.hasOwnProperty("ErrorCode")) {
				if (ALLOW_RETRY_ERROR_CODES.includes(record["ErrorCode"])) {
					retryItems.push(index);
				}
			}
		});
		return retryItems;
	}
}
