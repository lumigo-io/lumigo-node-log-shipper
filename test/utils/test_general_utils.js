const expect = require("chai").expect;
const generalUtils = require("../../src/utils/general_utils");
const fixutres = require("../../test/fixtures");

describe("general utils functionality ", () => {
	it("converts aws log event to luimgo records", () => {
		let parsedEvent = generalUtils.convertToLumigoRecords(fixutres.simpleAwsEvent());
		expect(parsedEvent).to.eql(fixutres.lumigoKinesisEvent());
	});
});
