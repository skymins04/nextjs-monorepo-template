module.exports = {
  extends: ["plugin:@typescript-eslint/eslint-recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["unused-imports"],
  rules: {
    "unused-imports/no-unused-imports": "error",
  },
};
