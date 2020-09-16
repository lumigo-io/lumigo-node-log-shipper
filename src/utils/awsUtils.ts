import { Buffer } from "buffer";
import { gunzipSync } from "zlib";
import { AwsLogSubscriptionEvent } from "../types/awsTypes";

export const extractAwsLogEvent = function(event: any): AwsLogSubscriptionEvent {
	let decodedData = Buffer.from(event["awslogs"]["data"], "base64");
	let decompressedData = gunzipSync(decodedData).toString("utf-8");
	return JSON.parse(decompressedData);
};

export const getCurrentRegion = function(): string {
	return process.env.AWS_REGION || "us-west-2";
};
