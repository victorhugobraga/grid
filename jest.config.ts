import type { Config } from "jest";

const config: Config = {
  projects: [
    {
      displayName: "node",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: [
        "**/__tests__/services/**/*.test.ts",
        "**/__tests__/api/**/*.test.ts",
        "**/__tests__/schemas/**/*.test.ts",
      ],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
    },
  ],
  collectCoverageFrom: [
    "src/services/**/*.ts",
    "src/schemas/**/*.ts",
    "src/lib/**/*.ts",
    "!src/**/*.d.ts",
  ],
};

export default config;
