// jest.config.js
export default {
  testEnvironment: "node",
  transform: {}, // no Babel needed for native ESM
  moduleFileExtensions: ["js", "json"],
  setupFiles: ["<rootDir>/src/Tests/jest.setup.js"], // ✅ add this line
};
