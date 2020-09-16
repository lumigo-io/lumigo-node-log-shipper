import {extractAwsLogEvent, getFunctionArn} from "../../src/utils/awsUtils";
import * as fixtures from "../../__testUtils__/fixtures";

describe("aws utils functionality ", () => {
	it("extracts aws log event", () => {
		let parsedEvent = extractAwsLogEvent(fixtures.rawAwsEvent());
		expect(parsedEvent).toEqual(fixtures.simpleAwsEvent());
	});

	it("returns correct function arn", () => {
		expect(getFunctionArn(fixtures.simpleAwsEvent())).toEqual(
			"arn:aws:lambda:us-west-2:142423218622:function:guymoses_customers-service_add-new-user"
		);
	});

	it("getFunctionArn returns null when logGroups not provided", () => {
		expect(getFunctionArn(fixtures.simpleAwsEventWithNoLogGroup())).toBeNull();
	});
});
