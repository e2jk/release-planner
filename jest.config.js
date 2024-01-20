module.exports = {
    moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "<rootDir>/jest/stub-transformer.js"
    },
    transformIgnorePatterns: ['node_modules/(?!(vis-timeline)/)'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest'
    }
};
  