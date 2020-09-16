import { Buffer } from "buffer";
import { gunzipSync } from "zlib";

export const extractAwsLogEvent = function(event: any) {
	let decodedData = Buffer.from(event["awslogs"]["data"], "base64").toString("base64");
	let decompressedData = gunzipSync(Buffer.from(decodedData, "base64")).toString(
		"utf-8"
	);
	return JSON.parse(decompressedData);
};

export const getCurrentRegion = function(): string {
	return process.env.AWS_REGION || "us-west-2";
};

export const getFunctionArn = function(awsLogEvent: any): string | null {
	let region = getCurrentRegion();
	if (awsLogEvent.hasOwnProperty("logGroup")) {
		let functionName = awsLogEvent["logGroup"].split("/")[3];
		return `arn:aws:lambda:${region}:${awsLogEvent.owner}:function:${functionName}`;
	}
	return null;
};
