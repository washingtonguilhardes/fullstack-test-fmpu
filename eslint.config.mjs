import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import pluginNext from '@next/eslint-plugin-next';
import pluginImportHelpers from 'eslint-plugin-import-helpers';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  {
    ignores: [
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.spec.js',
      '**/*.prettierrc.js',
      '.prettierrc.js',
      '**/*.d.ts',
      '**/dist/**',
      '*.js',
      '**/*.js',
      '**/node_modules/**',
      '**/.next/**',
      '**/ui/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs.flat.recommended,
    settings: {
      ...pluginReact.configs.flat.recommended.settings,
      react: {
        version: 'detect',
      },
    },
  },

  {
    plugins: {
      '@next/next': pluginNext,
    },
  },
  {
    files: ['apps/adminpanelv2/**/*.{ts,tsx}M'],
    rules: {
      ...pluginNext.configs.recommended.rules,
      'no-html-link-for-pages': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
        },
      ],

      'comma-dangle': 'off',
      semi: 'off',
      'no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/destructuring-assignment': ['error', 'always'],
      'react/prop-types': ['off'],
      'react/display-name': 'off',
      'no-use-before-define': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: [
            'module',
            '/^next/',
            '/^@driveapp/',
            '/^@/',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
      'lines-between-class-members': ['error', 'always'],
    },
    plugins: {
      'import-helpers': pluginImportHelpers,
      prettier: pluginPrettier,
      'react-hooks': pluginReactHooks,
    },
  },
]);
