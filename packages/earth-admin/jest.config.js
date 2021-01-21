module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['node_modules', '.cache', 'public'],

  globals: {
    'ts-jest': {
      // TypeScript errors cause the tests to fail. This disables that.
      diagnostics: false,
    },
  },

  // react-slick requirement
  setupFiles: ['<rootDir>/__mocks__/matchMedia.js'],

  // adds extra assertions like expect().toBeInTheDocument()
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

  // mocks style and image imports
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico|icon)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',

    '^@app/services(.*)$': '<rootDir>/src/services$1',
    '^@app/auth(.*)$': '<rootDir>/src/auth$1',
    '^@app/components(.*)$': '<rootDir>/src/components$1',
    '^@app/config(.*)$': '<rootDir>/src/config$1',
    '^@app/fonts(.*)$': '<rootDir>/src/fonts$1',
    '^@app/images(.*)$': '<rootDir>/src/images$1',
    '^@app/layouts(.*)$': '<rootDir>/src/layouts$1',
    '^@app/pages(.*)$': '<rootDir>/src/pages$1',
    '^@app/pages-client(.*)$': '<rootDir>/src/pages-client$1',
    '^@app/services(.*)$': '<rootDir>/src/services$1',
    '^@app/utils(.*)$': '<rootDir>/src/utils$1',
    '^@app/theme(.*)$': '<rootDir>/src/theme$1',
  },
};
