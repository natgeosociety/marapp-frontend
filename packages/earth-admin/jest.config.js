module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ["node_modules", ".cache", "public"],

  // adds extra assertions like expect().toBeInTheDocument()
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],

  // mocks style and image imports
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico|icon)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"
  },
};