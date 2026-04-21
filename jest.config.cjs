const { createDefaultEsmPreset } = require("ts-jest");

/** @type {import("jest").Config} **/
module.exports = {
  ...createDefaultEsmPreset(),
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  clearMocks: true
};