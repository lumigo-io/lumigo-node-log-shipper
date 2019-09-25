const Buffer = require("buffer").Buffer;
const zlib = require("zlib");

module.exports = {
	extractAwsLogEvent: function(event) {
	    let decodedData = Buffer.from(event["awslogs"]["data"], "base64").toString("base64");
	    let decompressedData = zlib.gunzipSync(Buffer.from(decodedData, "base64")).toString("utf-8");
	    return JSON.parse(decompressedData);
	},

	getCurrentRegion: function() {
		return process.env.AWS_REGION || "us-west-2";
	},

	getFunctionArn: function (awsLogEvent) {
		let region = this.getCurrentRegion();
		if (awsLogEvent.hasOwnProperty("logGroup")) {
			let functionName = awsLogEvent["logGroup"].split("/")[3];
			return `arn:aws:lambda:${region}:${awsLogEvent.owner}:function:${functionName}`;
		}
		return null;
	}
};