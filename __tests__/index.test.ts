import {shipLogs} from "../src";
import * as stsUtils from "../src/utils/stsUtils";
import * as fixutres from "../__testUtils__/fixtures";

//TODO: Remove this mocks into a infra mocker
export const STS_MOCKED_RESPONSE: any = {
			Credentials: {
				AccessKeyId: "AccessKeyId",
				SecretAccessKey: "SecretAccessKey",
				SessionToken: "SessionToken"
			}
		};


//TODO: Remove this mocks into a infra mocker
describe("log shipping functionality ", () => {
	it("sends logs - happy flow", async () => {
		jest.spyOn(stsUtils, "assumeRole").mockReturnValueOnce(STS_MOCKED_RESPONSE);

		const result = await shipLogs(fixutres.rawAwsEvent(), "[ERROR]");
		expect(result).toEqual(1);
	});

	it("doesn't ship big event", async () => {
		process.env.LUMIGO_ITEM_MAX_SIZE = String(1);

		const result = await shipLogs(fixutres.rawAwsEvent());
		expect(result).toEqual(0)
	});

	it("doesn't ship anything", async () => {
		const result = await shipLogs({});

		expect(result).toEqual(0);
	});

	it("ships 0 logs when kinesis couldn't be initiated", async () => {
		jest.spyOn(stsUtils, "assumeRole").mockRejectedValue(() => Error("RandomError"));

		const result = await shipLogs(fixutres.rawAwsEvent());
		expect(result).toEqual(0);
	});
});
