/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFiles: ["jest-canvas-mock"],
  setupFilesAfterEnv: ["<rootDir>/tests/unit/setupTests.js"],
  testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/E2E/"],
};

module.exports = config;
