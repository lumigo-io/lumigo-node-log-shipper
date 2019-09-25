const expect = require("chai").expect;
const sinon = require("sinon");
const LumigoLogger = require("../src/index");
const firehoseUtils = require("../src/utils/firehose_utils");
const fixutres = require("../test/fixtures");

describe("log shipping functionality ", () => {

	it("sends logs - happy flow", (done) => {
		let fake = sinon.fake.returns({"FailedPutCount": 0, "RequestResponses": []});
		sinon.stub(firehoseUtils.Firehose.prototype, "pushToFirehose").resolves(fake());
		LumigoLogger.log(fixutres.rawAwsEvent()).then(function(data) {
			expect(data).to.eq(2);
			firehoseUtils.Firehose.prototype.pushToFirehose.restore();
			done();
		});
		expect(fake.calledOnce).to.eq(true);
	});
});