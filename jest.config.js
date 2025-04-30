module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@server/(.*)$': '<rootDir>/server/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/client/src/test/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    '!client/src/main.tsx',
    '!client/src/test/**'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};