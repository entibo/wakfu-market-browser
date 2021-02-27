module.exports = {
  root: true,

  env: {
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2020,
  },

  ignorePatterns: ["**/*.worker.ts"],

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "@typescript-eslint/ban-ts-comment": "off"
  },

  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
}
