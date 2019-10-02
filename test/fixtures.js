const Buffer = require("buffer").Buffer;

module.exports = {
	createBigEvent: function() {
	    return {"Data": Buffer.from(JSON.stringify("A".repeat(10**6))).toString("base64")};
	},

	firehoseEvents: function() {
		return [
			{
			  "Data": "{\"event_details\":{\"function_details\":{\"resource_id\":\"arn:aws:lambda:us-west-2:142423218622:function:guymoses_customers-service_add-new-user\",\"memory\":0},\"timestamp\":1569495175073,\"aws_account_id\":\"142423218622\"},\"message\":\"[ERROR] ParameterNotFound: Missing Authorization\\rTraceback (most recent call last):\\r  File \\\"/var/task/lumigo_tracer/sync_http/sync_hook.py\\\", line 134, in lambda_wrapper\\r    return func(*args, **kwargs)\\r  File \\\"/var/task/_lumigo/add-new-user.py\\\", line 7, in handler\\r    return userHandler(event, context)\\r  File \\\"/var/task/lumigo_common_utils/aws/aws_utils.py\\\", line 375, in wrapper\\r    args[0][\\\"customer_id\\\"] = get_authenticated_customer_id(args[0])\\r  File \\\"/var/task/lumigo_common_utils/aws/aws_utils.py\\\", line 348, in get_authenticated_customer_id\\r    customer_id = get_jwt_payload_attribute_or_default(event, \\\"custom:customer\\\")\\r  File \\\"/var/task/lumigo_common_utils/aws/aws_utils.py\\\", line 331, in get_jwt_payload_attribute_or_default\\r    token = get_header_or_fail(event, \\\"Authorization\\\")\\r  File \\\"/var/task/lumigo_common_utils/aws/aws_utils.py\\\", line 267, in get_header_or_fail\\r    raise ParameterNotFound(f\\\"Missing {name}\\\")\\n\",\"timestamp\":1569495175073},"
			}
		];
	},

	simpleAwsEvent: function() {
		return {
			"messageType": "DATA_MESSAGE",
			"owner": "142423218622",
			"logGroup": "/aws/lambda/guymoses_customers-service_add-new-user",
			"logStream": "2019/09/26/[$LATEST]04de06936c794b6aba43996905b492ba",
			"subscriptionFilters": [
				"cloudwatch"
			],
			"logEvents": [
				{
					"id": "35000911989626184511773790667568665149429700037560893440",
					"timestamp": 1569495175073,
					"message": "[ERROR] ParameterNotFound: Missing Authorization\rTraceback (most recent call last):\r  File \"/var/task/lumigo_tracer/sync_http/sync_hook.py\", line 134, in lambda_wrapper\r    return func(*args, **kwargs)\r  File \"/var/task/_lumigo/add-new-user.py\", line 7, in handler\r    return userHandler(event, context)\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 375, in wrapper\r    args[0][\"customer_id\"] = get_authenticated_customer_id(args[0])\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 348, in get_authenticated_customer_id\r    customer_id = get_jwt_payload_attribute_or_default(event, \"custom:customer\")\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 331, in get_jwt_payload_attribute_or_default\r    token = get_header_or_fail(event, \"Authorization\")\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 267, in get_header_or_fail\r    raise ParameterNotFound(f\"Missing {name}\")\n"
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
				"data": "H4sIAAAAAAAAAK2TS27bMBCGr0IQXTiBU70p00AXBuqki6YtYu8sQxhRtM1aIgWSiusGuUvOkpOV8iNxkKbdBIIAaYac//tnyDtcc2NgyafbhuMh/jyajvLr8WQyuhrjPlYbybULB3EYh1EYDEgYunCllldatY3LeLAxXgV1UYK3bLe1MtzkrDVW1VybC8P1rWA8h7K8kHxz0brAvsDEag61qxD6AfV86oXEm334OpqOJ9O5H5fcJzQiLKVxQaCAOKKUUD8pYhoW4EqYtjBMi8YKJS9FZZ0aHs4wq1RbbsCyFZ7vdMa3XNoudYdF6eSixPd9GgR0QElIgkGcBEGaRin1CUkTMiAkCWIahzR16yIX8Qc0imPfSVrhmmWhdr6DhNCYJkGa+GnUPzbRlZ+Nb26+38zRD9BQc0f1TdlL1cpyiK6FMUIu0ai1K6XFb+jQMz3VwHgBbI16rnsWac4cMWJQVagCY8+GmX58eHxwJjnKsHcL2rNg1l7V1mKpctvt157ZSpavrG0OX0qtPzbbDPdRJSRHQRT3kZBoP6p8o6FpuN5X7h7NbaslWrSS9c5BL00fnZ+vN93X2Rv6+R7AO53tqWS6E1yBLKu/KHWrv+xzPd7NqI+Ykpb/sm/pHfwyVddK5q0VldmdPvfu/07F3eR28q+Mdo5m/nyW4eMpzUWZ4Tn6hJbc5uCG42AEA8vL/GRJ77DxfejiwY7un4rPzCfBA+bPjc0b2FYKyhys1aJoLc+Vzku+gLayx5YeXQ6PJTL8Pgai4MnA/1iefVi15vLgYMWhdI7csgWI6pn35e14H9qQpE+0L3VPjiUIw19f294iw8eLeydd7r5jkvh+fv8H3pJOiDwFAAA="
		    }
	    };
	},

	lumigoKinesisEvent: function () {
		return [
			{
				"event_details": {
					"function_details": {
						"resource_id": "arn:aws:lambda:us-west-2:142423218622:function:guymoses_customers-service_add-new-user",
						"memory": 0
					},
					"timestamp": 1569495175073,
					"aws_account_id": "142423218622"
				},
				"message": "[ERROR] ParameterNotFound: Missing Authorization\rTraceback (most recent call last):\r  File \"/var/task/lumigo_tracer/sync_http/sync_hook.py\", line 134, in lambda_wrapper\r    return func(*args, **kwargs)\r  File \"/var/task/_lumigo/add-new-user.py\", line 7, in handler\r    return userHandler(event, context)\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 375, in wrapper\r    args[0][\"customer_id\"] = get_authenticated_customer_id(args[0])\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 348, in get_authenticated_customer_id\r    customer_id = get_jwt_payload_attribute_or_default(event, \"custom:customer\")\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 331, in get_jwt_payload_attribute_or_default\r    token = get_header_or_fail(event, \"Authorization\")\r  File \"/var/task/lumigo_common_utils/aws/aws_utils.py\", line 267, in get_header_or_fail\r    raise ParameterNotFound(f\"Missing {name}\")\n",
				"timestamp": 1569495175073
			},
		];
	}
};