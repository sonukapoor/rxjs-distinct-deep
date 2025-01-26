module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true, // Enable coverage
  coverageDirectory: "coverage", // Output folder for coverage reports
  coverageReporters: ["text", "html"], // Output formats
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Include source files for coverage
    "!src/**/*.d.ts", // Exclude type definitions
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
