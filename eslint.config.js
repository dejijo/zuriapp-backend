const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-unreachable": "error",
    },
  },
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
];
