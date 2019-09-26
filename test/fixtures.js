const Buffer = require("buffer").Buffer;

module.exports = {
	createBigEvent: function() {
	    return {"Data": Buffer.from(JSON.stringify("A".repeat(10**6))).toString("base64")};
	},

	firehoseEvents: function() {
		return [
			{
			  "Data": "{\"event_details\":{\"function_details\":{\"resource_id\":\"arn:aws:lambda:us-west-2:335722316285:function:test-http-req\",\"memory\":0},\"timestamp\":1569238311100,\"aws_account_id\":\"335722316285\"},\"message\":\"END RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\\n\",\"timestamp\":1569238311100},"
			}, {
			  "Data": "{\"event_details\":{\"function_details\":{\"resource_id\":\"arn:aws:lambda:us-west-2:335722316285:function:test-http-req\",\"memory\":0},\"timestamp\":1569238311100,\"aws_account_id\":\"335722316285\"},\"message\":\"REPORT RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\\tDuration: 100.00 ms\\tBilled Duration: 200 ms\\tMemory Size: 128 MB\\tMax Memory Used: 75 MB\\tInit Duration: 156.08 ms\\t\\nXRAY TraceId: 1-5d88ad26-af7e1cf86161c0887567eed0\\tSegmentId: 2ea934c013374041\\tSampled: false\\t\\n\",\"timestamp\":1569238311100},"
			}
		];
	},

	simpleAwsEvent: function() {
		return {
			"messageType": "DATA_MESSAGE",
			"owner": "335722316285",
			"logGroup": "/aws/lambda/test-http-req",
			"logStream": "2019/09/23/[$LATEST]041e7430c6d94506b2bc7b29bd021803",
			"subscriptionFilters": [
				"LambdaStream_random"
			],
			"logEvents": [
				{
					"id": "34995183731613629262151179513935230756777419834003488768",
					"timestamp": 1569238311100,
					"message": "END RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\n"
				},
				{
					"id": "34995183731613629262151179513935230756777419834003488769",
					"timestamp": 1569238311100,
					"message": "REPORT RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\tDuration: 100.00 ms\tBilled Duration: 200 ms\tMemory Size: 128 MB\tMax Memory Used: 75 MB\tInit Duration: 156.08 ms\t\nXRAY TraceId: 1-5d88ad26-af7e1cf86161c0887567eed0\tSegmentId: 2ea934c013374041\tSampled: false\t\n"
				}
			]
		};
	},

	simpleAwsEventWithNoLogGroup: function() {
		return {
			"messageType": "DATA_MESSAGE",
			"owner": "335722316285",
			"logStream": "2019/09/23/[$LATEST]041e7430c6d94506b2bc7b29bd021803",
			"subscriptionFilters": [
				"LambdaStream_random"
			],
			"logEvents": [
				{
					"id": "34995183731613629262151179513935230756777419834003488768",
					"timestamp": 1569238311100,
					"message": "END RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\n"
				},
				{
					"id": "34995183731613629262151179513935230756777419834003488769",
					"timestamp": 1569238311100,
					"message": "REPORT RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\tDuration: 100.00 ms\tBilled Duration: 200 ms\tMemory Size: 128 MB\tMax Memory Used: 75 MB\tInit Duration: 156.08 ms\t\nXRAY TraceId: 1-5d88ad26-af7e1cf86161c0887567eed0\tSegmentId: 2ea934c013374041\tSampled: false\t\n"
				}
			]
		};
	},

	rawAwsEvent: function() {
		return {
			"awslogs": {
				"data": "H4sIAAAAAAAAAKVSy27bMBD8FYHo0YrIpcSHbw6sBgHitrBUoEViBJS0cgXo4Uh00yTwv3flpGiPLXqdGc4Mh3xhHU6T22P+dEC2ZOtVvrrfpFm2ukrZgg2PPY4ES5loACkUmITgdthfjcPxQEzkHqeodV1Rucjj5MNv3h/CER9eZZkf0XWkAy5sxG0EMrp9d7PK0yzf8VigjiUvVWXjhKsCilIXYIuKgzBcksV0LKZybA6+Gfr3TetxnNjylt2cA1/N70fXV0PHdufA9Dv2fta8sKaam8fWJsJITeWFVGBBgUiE0IRKKxOQXCdKax0La2TMuYyN0cpQtm9oG+86uqZIlAVppBCC88Wvzcg+/bAOtvhwJOF1tQyshhokqhBrV4SxsTo03PFQQGFq48AIy+96dlr8Xzv7l+226aeP2/yfC/r1cXTz4suADC84D7rpzl82bYtV8JuDN2KD3TA+BVnzjHQATLC5JND9CN6IzxNSsk7O+HXf+D88qPoFN2ebu/7LdvU1yEdX4lxVhElljKtAha7WKMraKFqp5LQAbYJYUdMM9x09+KwHdFbGJRdS6pi+FpG0Tjtn166dcE5gp93pJy17fMXzAgAA"
		    }
	    };
	},

	bigRawEvent: function() {
		return {
			"awslogs": {
				"data": "H4sIAAAAAAAAAKVSy27bMBD8FYHo0YrIpcSHbw6sBgHitrBUoEViBJS0cgXo4Uh00yTwv3flpGiPLXqdGc4Mh3xhHU6T22P+dEC2ZOtVvrrfpFm2ukrZgg2PPY4ES5loACkUmITgdthfjcPxQEzkHqeodV1Rucjj5MNv3h/CER9eZZkf0XWkAy5sxG0EMrp9d7PK0yzf8VigjiUvVWXjhKsCilIXYIuKgzBcksV0LKZybA6+Gfr3TetxnNjylt2cA1/N70fXV0PHdufA9Dv2fta8sKaam8fWJsJITeWFVGBBgUiE0IRKKxOQXCdKax0La2TMuYyN0cpQtm9oG+86uqZIlAVppBCC88Wvzcg+/bAOtvhwJOF1tQyshhokqhBrV4SxsTo03PFQQGFq48AIy+96dlr8Xzv7l+226aeP2/yfC/r1cXTz4suADC84D7rpzl82bYtV8JuDN2KD3TA+BVnzjHQATLC5JND9CN6IzxNSsk7O+HXf+D88qPoFN2ebu/7LdvU1yEdX4lxVhElljKtAha7WKMraKFqp5LQAbYJYUdMM9x09+KwHdFbGJRdS6pi+FpG0Tjtn166dcE5gp93pJy17fMXzAgAA"
		    }
	    };
	},

	lumigoKinesisEvent: function () {
		return [
			{
				"event_details": {
					"function_details": {
						"resource_id": "arn:aws:lambda:us-west-2:335722316285:function:test-http-req",
						"memory": 0
					},
					"timestamp": 1569238311100,
					"aws_account_id": "335722316285"
				},
				"message": "END RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\n",
				"timestamp": 1569238311100
			},
			{
				"event_details": {
					"function_details": {
						"resource_id": "arn:aws:lambda:us-west-2:335722316285:function:test-http-req",
						"memory": 0
					},
					"timestamp": 1569238311100,
					"aws_account_id": "335722316285"
				},
				"message": "REPORT RequestId: 972f23e6-efab-4897-80a0-12b8f8a28190\tDuration: 100.00 ms\tBilled Duration: 200 ms\tMemory Size: 128 MB\tMax Memory Used: 75 MB\tInit Duration: 156.08 ms\t\nXRAY TraceId: 1-5d88ad26-af7e1cf86161c0887567eed0\tSegmentId: 2ea934c013374041\tSampled: false\t\n",
				"timestamp": 1569238311100
			}
		];
	}
};