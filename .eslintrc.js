module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "react/jsx-filename-extension": [2, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    "import/no-extraneous-dependencies": [2, { devDependencies: ["**/test.tsx", "**/test.ts"] }],
    "@typescript-eslint/indent": [2, 2],
    "react/prop-types": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "import/prefer-default-export": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    jest: true,
  }
};
