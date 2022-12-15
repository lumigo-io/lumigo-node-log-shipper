module.exports = {
	collectCoverage: true,

	collectCoverageFrom: ["src/**/*.ts", "src/**/*.js"],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 70,
			lines: 80,
			statements: 80
		}
	},
	testEnvironment: "node",
	preset: "ts-jest",
	setupFilesAfterEnv: ["./__testUtils__/jest.setup.ts"]
};
