module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 10,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': 0,
    'no-undef': 0,
  },
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
};
