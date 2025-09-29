module.exports = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**/*", "node_modules/**/*"],
  rules: {
    "selector-class-pattern": null,
    "color-hex-length": "long",
    "alpha-value-notation": "number",
    "no-descending-specificity": null
  }
};
