import * as generalUtils from "../../src/utils/generalUtils";
import * as fixutres from "../../__testUtils__/fixtures";
import { AwsLogEvent } from "../../src/types/awsTypes";

const eventFromMessage = (message: string): AwsLogEvent => ({
	message: message,
	id: "Dummy",
	timestamp: 123456,
});

describe("general utils functionality ", () => {
	it("validates record", () => {
		let event1 = eventFromMessage("AAAAAA-Task timed out-BBBBB");
		let event2 = eventFromMessage("Process exited before completing request-BBBBB");
		let event3 = eventFromMessage("REPORT RequestId");
		let event4 = eventFromMessage("NON-VALID-EVENT");

		expect(generalUtils.isValidEvent(event1)).toEqual(true);
		expect(generalUtils.isValidEvent(event2)).toEqual(true);
		expect(generalUtils.isValidEvent(event3)).toEqual(true);
		expect(generalUtils.isValidEvent(event4)).toEqual(false);
	});

	it("adds programatic error and validates it", () => {
		let programaticError = "[ERROR]";
		let event1 = fixutres.simpleAwsEvent();
		event1.logEvents[0].message = "SHOULD_NOT_WORK";
		let event2 = fixutres.simpleAwsEvent();
		event2.logEvents[0].message = "[ERROR] 12345";

		expect(generalUtils.filterMessagesFromRecord(event1).logEvents).toHaveLength(0);
		expect(generalUtils.filterMessagesFromRecord(event2, programaticError)).toEqual(
			event2
		);
	});
});
