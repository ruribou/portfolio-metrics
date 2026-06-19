// Flat ESLint config for the TypeScript (.ts) sources.
//
// Prettier owns formatting (eslint-config-prettier turns the stylistic rules
// off), so ESLint here is for code quality only. Rules are intentionally
// lenient to fit the staged migration: the engine leans on `any`, and plugins
// still carry `// @ts-nocheck` until they are individually typed.
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"
import globals from "globals"

export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "source/plugins/community/splatoon/s3si/",
      "source/plugins/community/splatoon/token.ts",
      ".github/scripts/quickstart/plugin/",
      "source/app/web/statics/",
      "tests/",
      "**/*.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["source/**/*.ts", ".github/scripts/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {...globals.node, ...globals.browser},
    },
    rules: {
      // The dynamic engine is typed loosely on purpose (see source/app/metrics/types.ts).
      "@typescript-eslint/no-explicit-any": "off",
      // Plugins/templates/scripts use `// @ts-nocheck` during the staged migration.
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none"}],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-empty": ["error", {allowEmptyCatch: true}],
      "no-control-regex": "off",
      "no-useless-escape": "off",
      "no-cond-assign": ["error", "except-parens"],
      "prefer-const": "warn",
      // Patterns the upstream metrics code relies on (its .eslintrc disabled these too).
      "no-async-promise-executor": "off",
      "no-ex-assign": "off",
      "no-unsafe-finally": "off",
      "no-misleading-character-class": "off",
      "prefer-rest-params": "off",
      // New ESLint 10 rules that are noisy against the dynamic, mid-migration code.
      "no-useless-assignment": "off",
      "preserve-caught-error": "off",
    },
  },
)
