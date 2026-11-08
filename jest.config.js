module.exports = {
  preset: 'jest-expo',
  // immer's "react-native" export is an ES module Jest can't run untransformed
  moduleNameMapper: {
    '^immer$': '<rootDir>/node_modules/immer/dist/cjs/index.js',
  },
};
