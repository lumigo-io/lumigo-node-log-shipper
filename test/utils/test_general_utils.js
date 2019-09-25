const expect = require("chai").expect;
const generalUtils = require("../../src/utils/general_utils");
const fixutres = require("../../test/fixtures");

describe("general utils functionality ", () => {
	it("converts aws log event to luimgo records", () => {
		let parsedEvent = generalUtils.convertToLumigoRecords(fixutres.simpleAwsEvent());
		expect(parsedEvent).to.eql(fixutres.lumigoKinesisEvent());
	});

	it("validates record", () => {
		let record1 = {"message": "AAAAAA-Task timed out-BBBBB"};
		let record2 = {"message": "Process exited before completing request-BBBBB"};
		let record3 = {"message": "REPORT RequestId"};
		let record4 = {"message": "NON-VALID-EVENT"};

		expect(generalUtils.validEvent(record1)).to.eq(true);
		expect(generalUtils.validEvent(record2)).to.eq(true);
		expect(generalUtils.validEvent(record3)).to.eq(true);
		expect(generalUtils.validEvent(record4)).to.eq(false);
	});

	it("adds programatic error and validates it", () => {
		let programaticError = "123";
		let event1 = fixutres.simpleAwsEvent();
		let event2 = fixutres.simpleAwsEvent();
		event2["logEvents"][0]["message"] = "12345";

		expect(generalUtils.filterRecords(event1)["logEvents"]).to.have.lengthOf(1);
		expect(generalUtils.filterRecords(event2, programaticError)["logEvents"]).to.have.lengthOf(2);
	});
});
