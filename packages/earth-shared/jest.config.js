module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['node_modules', 'coverage'],

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

  moduleNameMapper: {
    // mocks style and image imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico|icon)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
};
