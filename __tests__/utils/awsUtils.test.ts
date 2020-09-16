import { extractAwsLogEvent } from "../../src/utils/awsUtils";
import * as fixtures from "../../__testUtils__/fixtures";

describe("aws utils functionality ", () => {
	it("extracts aws log event", () => {
		let parsedEvent = extractAwsLogEvent(fixtures.rawAwsEvent());
		expect(parsedEvent).toEqual(fixtures.simpleAwsEvent());
	});
});
