module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ["node_modules", "build", "public"],

  // adds extra assertions like expect().toBeInTheDocument()
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],

  moduleNameMapper: {

    // mocks style and image imports
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",

    "^auth(.*)$": "<rootDir>/src/auth$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^config(.*)$": "<rootDir>/src/config$1",
    "^fonts(.*)$": "<rootDir>/src/fonts$1",
    "^modules(.*)$": "<rootDir>/src/modules$1",
    "^pages(.*)$": "<rootDir>/src/pages$1",
    "^sagas(.*)$": "<rootDir>/src/sagas$1",
    "^services(.*)$": "<rootDir>/src/services$1",
    "^store(.*)$": "<rootDir>/src/store$1",
    "^utils(.*)$": "<rootDir>/src/utils$1",
    "^utils(.*)$": "<rootDir>/src/utils$1",

    // why is constants not working?
    // "^constants(.*)$": "<rootDir>/src/constants$1",
  },
};