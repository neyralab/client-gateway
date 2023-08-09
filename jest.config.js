module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/src/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.tsx"],
};
