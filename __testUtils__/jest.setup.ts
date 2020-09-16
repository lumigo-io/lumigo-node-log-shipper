import { AwsMocker } from "./awsMocker";

const oldEnv = Object.assign({}, process.env);

AwsMocker.applyMock();

beforeEach(() => {
	process.env = { ...oldEnv };
	AwsMocker.resetAll();
});

afterEach(() => {
	process.env = { ...oldEnv };
});
