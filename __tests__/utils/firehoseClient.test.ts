import { FirehoseClient } from "../../src/utils/firehoseClient";
import * as stsUtils from "../../src/utils/stsUtils";
import * as fixutres from "../../__testUtils__/fixtures";
import { STS_MOCKED_RESPONSE } from "../index.test";
import { FirehoseDataForTesting } from "../../__testUtils__/firehoseMocker";

describe("FirehoseClient", () => {
	let firehose: any;
	beforeEach(() => {
		firehose = new FirehoseClient("test-firehose-log-stream", "142423218622");
		jest.spyOn(stsUtils, "assumeRole").mockReturnValueOnce(STS_MOCKED_RESPONSE);
	});

	it("converts to firehose events", () => {
		let events = firehose.convertToFirehoseEvents(fixutres.lumigoKinesisEvent());
		expect(events).toEqual(fixutres.firehoseEvents());
	});

	it("pareses problematic firehose response records", () => {
		let responseRecords = [
			{ ErrorCode: "ServiceUnavailableException", ErrorMessage: "Error #1" },
			{ ErrorCode: "otherException", ErrorMessage: "Error #2" },
			{ ErrorCode: "InternalFailure", ErrorMessage: "Error #3" },
		];

		let problematicRecords =
			firehose.parseFirehoseProblematicRecords(responseRecords);
		expect(problematicRecords).toBeInstanceOf(Array);
		expect(problematicRecords).toEqual([0, 2]);
	});

	it("checks validity of a firehose event", () => {
		expect(firehose.validFirehoseEvent({ Data: "" }, 1)).toBeFalsy();
		expect(firehose.validFirehoseEvent({ Data: "" }, 100)).toBeTruthy();
	});

	it("handles retry items", () => {
		let allRecrds = [
			{ id: 1 },
			{ id: 2 },
			{ id: 3 },
			{ id: 4 },
			{ id: 4 },
			{ id: 5 },
		];
		let retryItems = [0, 2];
		expect(firehose.handleRetryItems(allRecrds, retryItems)).toEqual([
			{ id: 1 },
			{ id: 3 },
		]);
	});

	it("pushes items to firehose", async () => {
		const result = await firehose.pushToFirehose(
			fixutres.firehoseEvents(),
			"stream-name"
		);

		const requests = FirehoseDataForTesting.getRequests();
		expect(result).toEqual({
			FailedPutCount: 0,
			RequestResponses: [{ RecordId: 0 }],
		});
		//TODO: Compare object
		expect(requests).toEqual([
			[
				{
					Data: '{"event_details":{"function_details":{"resource_id":"arn:aws:lambda:us-west-2:142423218622:function:guymoses_customers-service_add-new-user","memory":0},"timestamp":1569495175073,"aws_account_id":"142423218622"},"message":"[ERROR] ParameterNotFound: Missing Authorization\\rTraceback (most recent call last):\\r  File \\"/var/task/lumigo_tracer/sync_http/sync_hook.py\\", line 134, in lambda_wrapper\\r    return func(*args, **kwargs)\\r  File \\"/var/task/_lumigo/add-new-user.py\\", line 7, in handler\\r    return userHandler(event, context)\\r  File \\"/var/task/lumigo_common_utils/aws/aws_utils.py\\", line 375, in wrapper\\r    args[0][\\"customer_id\\"] = get_authenticated_customer_id(args[0])\\r  File \\"/var/task/lumigo_common_utils/aws/aws_utils.py\\", line 348, in get_authenticated_customer_id\\r    customer_id = get_jwt_payload_attribute_or_default(event, \\"custom:customer\\")\\r  File \\"/var/task/lumigo_common_utils/aws/aws_utils.py\\", line 331, in get_jwt_payload_attribute_or_default\\r    token = get_header_or_fail(event, \\"Authorization\\")\\r  File \\"/var/task/lumigo_common_utils/aws/aws_utils.py\\", line 267, in get_header_or_fail\\r    raise ParameterNotFound(f\\"Missing {name}\\")\\n","timestamp":1569495175073}\n',
				},
			],
		]);
	});

	it("puts records batch", async () => {
		const result = await firehose.putRecordsBatch(fixutres.lumigoKinesisEvent());

		expect(result).toEqual(1);
	});

	it("puts records batch with greater than max retries", async () => {
		FirehoseDataForTesting.failedForTheNext(100);

		const result = await firehose.putRecordsBatch(fixutres.lumigoKinesisEvent());

		expect(result).toEqual(0);
	});

	it("puts records batch with less than max retries", async () => {
		FirehoseDataForTesting.failedForTheNext(1);

		const result = await firehose.putRecordsBatch(fixutres.lumigoKinesisEvent());

		expect(result).toEqual(1);
	});
});
