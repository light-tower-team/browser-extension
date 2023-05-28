const fs = require("fs");

const folders = fs
  .readdirSync("src", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

module.exports = {
  root: true,
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "react",
    "jsx-a11y",
    "@typescript-eslint",
    "import",
    "react-hooks",
    "simple-import-sort",
    "prettier",
  ],
  overrides: [
    {
      files: ["*.tsx", "*.ts", "*.js", "*.jsx"],
      rules: {
        "simple-import-sort/imports": [
          "warn",
          {
            groups: [
              // Packages. `react` related packages come first.
              // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
              ["^\\u0000", "^react$", "^@?\\w"],
              // Absolute imports
              [`^(${folders.join("|")})(/.*|$)`],
              // Relative imports.
              ["^\\."],
              // for scss imports.
              ["^[^.]"],
            ],
          },
        ],
        "no-restricted-globals": 0,
      },
    },
  ],
  rules: {
    // common
    "brace-style": [
      "error",
      "1tbs",
      {
        allowSingleLine: false,
      },
    ],
    curly: "error",
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
    "no-debugger": "error",
    // typescript
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "never",
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["typeLike", "enumMember"],
        format: ["PascalCase"],
      },
      {
        selector: ["variable"],
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
      {
        selector: ["function"],
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "typeParameter",
        format: ["PascalCase"],
        prefix: ["T"],
      },
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: true,
        },
      },
    ],
    // import
    "import/no-anonymous-default-export": "error",
    "import/no-named-as-default-member": "off",
    // react
    "react/prop-types": "off",
    "react/jsx-pascal-case": "error",
    "react/jsx-boolean-value": ["error", "never"],
    "react/jsx-closing-bracket-location": "error",
    "react/self-closing-comp": "error",
  },
};
