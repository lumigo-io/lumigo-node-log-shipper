const expect = require("chai").expect;
const utils = require("../../src/utils/aws_utils");
const fixutres = require("../../test/fixtures");

describe("aws utils functionality ", () => {
	it("extracts aws log event", () => {
		let parsedEvent = utils.extractAwsLogEvent(fixutres.rawAwsEvent());
		expect(parsedEvent).to.eql(fixutres.simpleAwsEvent());
	});

	it("returns correct function arn", () => {
		expect(utils.getFunctionArn(fixutres.simpleAwsEvent())).to.eq("arn:aws:lambda:us-west-2:335722316285:function:test-http-req");
	});

	it("getFunctionArn returns null when logGroups not provided", () => {
		expect(utils.getFunctionArn(fixutres.simpleAwsEventWithNoLogGroup())).to.eq(null);
	});
});