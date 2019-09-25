const awsUtils = require("../utils/aws_utils");

module.exports = {
	convertToLumigoRecords: function(awsLogEvent) {
	    let records = [];
		let functionArn = awsUtils.getFunctionArn(awsLogEvent);
		let owner;
		if (awsLogEvent.hasOwnProperty("owner")) {
			owner = awsLogEvent["owner"];
		}
		if (awsLogEvent.hasOwnProperty("logEvents") && Array.isArray(awsLogEvent["logEvents"])) {
		    awsLogEvent["logEvents"].forEach(function(event) {
				let convertedEvent = {};
				convertedEvent["event_details"] = {};
				convertedEvent["event_details"]["function_details"] = {};

				if (event.hasOwnProperty("message")) {
					convertedEvent["message"] = event["message"];
				}
				if (event.hasOwnProperty("timestamp")) {
					convertedEvent["timestamp"] = event["timestamp"];
					convertedEvent["event_details"]["timestamp"] = event["timestamp"];
				}
				convertedEvent["event_details"]["aws_account_id"] = owner;
				convertedEvent["event_details"]["function_details"]["resource_id"] = functionArn;
				convertedEvent["event_details"]["function_details"]["memory"] = 0;  // We cant get memory of the running function from the log-shipper function
				records.push(convertedEvent);
			});
		}
		return records;
	}
};