import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])




// *OR




// import js from "@eslint/js";
// import globals from "globals";
// import react from "eslint-plugin-react";
// import reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
// import tseslint from "typescript-eslint";

// export default tseslint.config(
//   { ignores: ["dist", "node_modules", "src/js/*.js"] },
//   js.configs.recommended,
//   ...tseslint.configs.recommended,

//   // Main config for JS/TS/JSX/TSX files
//   {
//     files: ["**/*.{js,jsx,ts,tsx}"],
//     languageOptions: {
//       globals: globals.browser,
//       ecmaVersion: 2020,
//       sourceType: "module",
//     },
//     plugins: {
//       react,
//       "react-hooks": reactHooks,
//       "react-refresh": reactRefresh,
//     },
//     settings: {
//       react: { version: "detect" },
//     },
//     rules: {
//       // React recommended rules (only the .rules part)
//       ...react.configs.recommended.rules,
//       ...react.configs["jsx-runtime"].rules,

//       // React Hooks
//       ...reactHooks.configs.recommended.rules,

//       // React Refresh
//       "react-refresh/only-export-components": [
//         "warn",
//         { allowConstantExport: true },
//       ],

//       // === YOUR CUSTOM OVERRIDES (moved here so they apply to .tsx files) ===
//       "@typescript-eslint/no-unused-expressions": "off",     // Fixes all && <Component /> cases
//       "@typescript-eslint/no-explicit-any": "warn",         // Downgrades any to warning
//       "@typescript-eslint/no-unused-vars": "warn",          // Downgrades unused vars to warning
//       "no-unused-vars": "off",                              // Let TS handle it

//       "react/prop-types": "off",
//       "react/jsx-uses-react": "off",
//       "react/react-in-jsx-scope": "off",
//     },
//   },

//   // Separate override ONLY for .cjs files (CommonJS config files)
//   {
//     files: ["**/*.cjs"],
//     languageOptions: {
//       globals: globals.node,
//       sourceType: "commonjs",
//     },
//     rules: {
//       "@typescript-eslint/no-require-imports": "off",
//       "no-undef": "off",
//     },
//   },

//   // Declaration files
//   {
//     files: ["**/*.d.ts"],
//     rules: {
//       "@typescript-eslint/no-explicit-any": "off",
//     },
//   }
// );
