module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  "plugins": [
    "@typescript-eslint",
    "prettier",
    "unicorn" ,
    "import",
    "json"
  ],
  extends: [
    'plugin:react/recommended',
    'standard',
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "plugin:json/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  "settings": {
    "react": {
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
    },
  },
  rules: {
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
  }
}
