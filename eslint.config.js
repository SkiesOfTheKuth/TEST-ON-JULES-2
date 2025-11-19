import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        navigator: "readonly"
      }
    },
    rules: {
      "no-console": ["warn", { allow: ["error"] }],
      "no-alert": "error",
      "no-implicit-globals": "error",
      "import/no-unresolved": "off"
    }
  }
];
