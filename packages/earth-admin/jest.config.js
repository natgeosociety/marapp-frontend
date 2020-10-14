module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ["node_modules", ".cache", "public"],

  // adds extra assertions like expect().toBeInTheDocument()
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],

  // moduleNameMapper: {
  //   '^@app/(.*)$': '<rootDir>/src/$1',
  // }
};