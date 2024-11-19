// Config from ChatGPT
/** @type {import('ts-jest').JestConfigWithTsJest} */
export const preset = "ts-jest";
export const testEnvironment = "jest-environment-jsdom";
export const transform = {
  "^.+\\.tsx?$": "ts-jest",
};
export const moduleFileExtensions = ["ts", "tsx", "js", "jsx"];
export const roots = ["<rootDir>/src"];
