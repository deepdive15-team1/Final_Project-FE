// @ts-check
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import { fixupPluginRules } from "@eslint/compat";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import reactRresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierPluginRecommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: import.meta.dirname,
        project: ["tsconfig.node.json", "tsconfig.app.json"],
      },
      globals: { ...globals.browser },
    },
  },
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": fixupPluginRules(reactHooksPlugin),
      "react-refresh": reactRresh,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactPlugin.configs["recommended"].rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "prettier/prettier": "warn",
      "react-refresh/only-export-components": "warn",
    },
  },
);
