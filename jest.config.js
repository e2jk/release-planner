module.exports = {
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': '<rootDir>/jest/stub-transformer.js'
  },
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  // coverageThreshold: {
  //     global: {
  //         lines: 90,
  //     },
  // },
  coveragePathIgnorePatterns: [
    '<rootDir>/jest/',
    '<rootDir>/coverage/',
    '<rootDir>/.*.config.js',
    '<rootDir>/public/',
    '<rootDir>/.eslintrc.js'
  ],
  transformIgnorePatterns: ['node_modules/(?!(vis-timeline)/)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest'
  }
}
