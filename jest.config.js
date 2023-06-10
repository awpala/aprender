module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/db/',
    '<rootDir>/public/',
    '<rootDir>/sass/',
  ],
};
