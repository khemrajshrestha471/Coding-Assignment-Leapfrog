module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Use jsdom for browser-like environment
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js'], // Include the setup file
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use Babel for transforming files
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Optional: For path aliases
  },
};