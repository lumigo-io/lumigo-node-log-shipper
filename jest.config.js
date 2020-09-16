module.exports = {
	collectCoverage: true,

	collectCoverageFrom: ["src/**/*.ts", "src/**/*.js"],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 90,
			statements: 90
		}
	},
	testEnvironment: "node",
	preset: "ts-jest",
	setupFilesAfterEnv: ["./__testUtils__/jest.setup.ts"]
};
