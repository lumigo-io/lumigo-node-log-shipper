import { AwsMocker } from "./awsMocker";

const oldEnv = Object.assign({}, process.env);
const oldConsole = Object.assign({}, console);

AwsMocker.applyMock();

beforeEach(() => {
	process.env = { ...oldEnv };
	console = { ...oldConsole };
	AwsMocker.resetAll();
});

afterEach(() => {
	process.env = { ...oldEnv };
	console = { ...oldConsole };
});
