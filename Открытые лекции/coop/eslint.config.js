import js from "@eslint/js";

import globals from "globals";
import tsEslint from "typescript-eslint";

import {defineConfig, globalIgnores} from "eslint/config";

export default defineConfig([
  globalIgnores(["./dist"]),

  {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      plugins: {js},
      extends: ["js/recommended"],
      languageOptions: {globals: globals.node},
      rules: {
          "semi": ["error", "always"],
          "no-extra-semi": "error",
      }
  },

  tsEslint.configs.recommended.map((config) => ({
    ...config,
    rules: {
      ...config.rules,
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
    }
  }))
]);
