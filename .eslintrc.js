module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@babel/eslint-parser', // Specify the parser
  plugins: ['react'], // Specify ESLint plugins
  // Use recommended rules from the eslint:recommended and react/recommended rule sets
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};
