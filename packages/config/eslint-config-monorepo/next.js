module.exports = {
  extends: ["./index.js", "next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  plugins: ["unused-imports"],
  rules: {
    "no-console": ["error", { allow: ["debug", "warn", "error"] }],
    "react/display-name": "off",
  },
};
