import { logDebug } from "../../src/utils/logger";

describe("logger functionality ", () => {
	it("no logs when LUMIGO_DEBUG isn't set", () => {
		console.log = jest.fn();

		delete process.env.LUMIGO_DEBUG;
		logDebug("test");
		expect(console.log).not.toHaveBeenCalled();
	});

	it("logs when LUMIGO_DEBUG is set", () => {
		console.log = jest.fn();

		process.env.LUMIGO_DEBUG = "true";
		logDebug("test");
		expect(console.log).toHaveBeenCalled();

		process.env.LUMIGO_DEBUG = "false";
		logDebug("test");
		expect(console.log).toHaveBeenCalled();
	});
});
