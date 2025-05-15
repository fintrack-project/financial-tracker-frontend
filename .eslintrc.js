module.exports = {
  extends: [
    "react-app",
    "react-app/jest"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "no-mixed-operators": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-useless-escape": "error",
    "import/no-unused-modules": "error"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}; 