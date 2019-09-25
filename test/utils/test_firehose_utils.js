const expect = require("chai").expect;
const sinon = require("sinon");
const firehoseUtils = require("../../src/utils/firehose_utils");
const fixutres = require("../../test/fixtures");

describe("log shipping functionality ", () => {
	let firehose;
	before(function() {
		firehose = new firehoseUtils.Firehose("test-firehose-log-stream");
	});

	it("converts to firehose events", () => {
		let events = firehose.convertToFirehoseEvents(fixutres.lumigoKinesisEvent());
		expect(events).to.eql(fixutres.firehoseEvents());
	});

	it("pareses problematic firehose response records", () => {
		let responseRecords =
			[{"ErrorCode": "ServiceUnavailableException", "ErrorMessage": "Error #1"},
				{"ErrorCode": "otherException", "ErrorMessage": "Error #2"},
				{"ErrorCode": "InternalFailure", "ErrorMessage": "Error #3"}];

		let problematicRecords = firehose.parseFirehoseProblematicRecords(responseRecords);
		expect(problematicRecords).to.be.an("array");
		expect(problematicRecords).to.eql([0, 2]);
	});

	it("checks validity of a firehose event", () => {
		expect(firehose.validFirehoseEvent(fixutres.createBigEvent())).to.eq(false);
	});

	it("handles retry items", () => {
		let allRecrds = [{"id": 1},{"id": 2},{"id": 3},{"id": 4},{"id": 4},{"id": 5}];
		let retryItems = [0, 2];
		expect(firehose.handleRetryItems(allRecrds, retryItems)).to.eql([{"id": 1}, {"id": 3}]);
	});

	it("pushes items to firehose", (done) => {
		const putRecordBatchFake = (param, func) => {
			func(false, {"FailedPutCount": 0, "RequestResponses": []});
		};
		sinon.stub(firehose.firehose, "putRecordBatch").callsFake(putRecordBatchFake);
		firehose.pushToFirehose(fixutres.firehoseEvents(),"stream-name").then(function(response) {
			expect(response).to.eql({"FailedPutCount": 0, "RequestResponses": []});
			firehose.firehose.putRecordBatch.restore();
			done();
		});

	});

	it("pushes items to firehose with rejection", (done) => {
		const putRecordBatchFake = (param, func) => {
			func(true, {"FailedPutCount": 0, "RequestResponses": []});
		};
		sinon.stub(firehose.firehose, "putRecordBatch").callsFake(putRecordBatchFake);
		firehose.pushToFirehose(fixutres.firehoseEvents(),"stream-name").catch(function() {
			firehose.firehose.putRecordBatch.restore();
			done();
		});
	});

	it("puts records batch", (done) => {
		let fake = sinon.fake.returns({"FailedPutCount": 0, "RequestResponses": []});
		sinon.stub(firehoseUtils.Firehose.prototype, "pushToFirehose").resolves(fake());
		firehose.putRecordsBatch(fixutres.lumigoKinesisEvent()).then(function(response){
			expect(response).to.eq(2);
			firehose.pushToFirehose.restore();
			done();
		});
	});

	it("puts records batch with greater than max retries", (done) => {

		let fake = sinon.fake.returns({"FailedPutCount": 2, "RequestResponses": [{"ErrorCode": "ServiceUnavailableException"}, {"ErrorCode": "ServiceUnavailableException"}]});
		sinon.stub(firehoseUtils.Firehose.prototype, "pushToFirehose").resolves(fake());
		firehose.putRecordsBatch(fixutres.lumigoKinesisEvent()).then(function(response){
			expect(response).to.eq(0);
			firehose.pushToFirehose.restore();
			done();
		});
	});

	it("puts records batch with retries", (done) => {
		let fake1 = sinon.fake.returns({"FailedPutCount": 2, "RequestResponses": [{"ErrorCode": "ServiceUnavailableException"}, {"ErrorCode": "ServiceUnavailableException"}]});
		let fake2 = sinon.fake.returns({"FailedPutCount": 0, "RequestResponses": []});
		let stub = sinon.stub(firehoseUtils.Firehose.prototype, "pushToFirehose");
		stub.onCall(0).resolves(fake1());
		stub.onCall(1).resolves(fake1());
		stub.onCall(2).resolves(fake2());
		firehose.putRecordsBatch(fixutres.lumigoKinesisEvent()).then(function(response){
			expect(response).to.eq(2);
			firehose.pushToFirehose.restore();
			done();
		});
	});
});