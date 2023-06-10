module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/server/controllers/*.test.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  // setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
  ],
};
