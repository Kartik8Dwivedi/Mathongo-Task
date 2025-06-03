// ✅ mock Redis globally for all tests
import { jest } from "@jest/globals";
jest.mock("../Config/redis.js", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    flushall: jest.fn(),
  },
}));
