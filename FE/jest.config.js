const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust based on your project structure
  },

  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx,js,jsx}',
    'src/app/about/*.{ts,tsx,js,jsx}',
    'src/app/contact/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};

module.exports = createJestConfig(customJestConfig);
