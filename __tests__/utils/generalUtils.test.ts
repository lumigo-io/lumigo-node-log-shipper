import * as generalUtils from "../../src/utils/generalUtils";
import * as fixutres from "../../__testUtils__/fixtures";

describe("general utils functionality ", () => {
	it("converts aws log event to luimgo records", () => {
		let parsedEvent = generalUtils.convertToLumigoRecords(fixutres.simpleAwsEvent());
		expect(parsedEvent).toEqual(fixutres.lumigoKinesisEvent());
	});

	it("validates record", () => {
		let record1 = { message: "AAAAAA-Task timed out-BBBBB" };
		let record2 = { message: "Process exited before completing request-BBBBB" };
		let record3 = { message: "REPORT RequestId" };
		let record4 = { message: "NON-VALID-EVENT" };

		expect(generalUtils.isValidEvent(record1)).toEqual(true);
		expect(generalUtils.isValidEvent(record2)).toEqual(true);
		expect(generalUtils.isValidEvent(record3)).toEqual(true);
		expect(generalUtils.isValidEvent(record4)).toEqual(false);
	});

	it("adds programatic error and validates it", () => {
		let programaticError = "[ERROR]";
		let event1 = fixutres.simpleAwsEvent();
		event1["logEvents"][0]["message"] = "SHOULD_NOT_WORK";
		let event2 = fixutres.simpleAwsEvent();
		event2["logEvents"][0]["message"] = "[ERROR] 12345";

		expect(generalUtils.filterRecords(event1)["logEvents"]).toHaveLength(0);
		expect(generalUtils.filterRecords(event2, programaticError)).toEqual(event2);
	});
});
