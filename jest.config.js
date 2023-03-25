/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/unit/setupTests.js"],
  testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/E2E/"],
};

module.exports = config;
