import { BrowserPlatform } from "@aurelia/platform-browser";
import { setPlatform } from "@aurelia/testing";


// Dependencies added for testing :
// npm install --save-dev jest
// npm install --save-dev @types/jest
// npm install --save-dev ts-jest
// npm install --save-dev jest-environment-jsdom

// Jest config generated with
// npx ts-jest config:init

// Script added in package.json
// "test": "jest",
// "test:watch": "jest --watch"

// This function sets up the Aurelia environment for testing
// https://docs.aurelia.io/developer-guides/overview
// This is usefull when we want to test DOM manipulations
export function bootstrapTestEnvironment() {
  const platform = new BrowserPlatform(window);
  setPlatform(platform);
  BrowserPlatform.set(globalThis, platform);
}
