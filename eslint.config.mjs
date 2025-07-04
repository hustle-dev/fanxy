import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import configPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
  { ignores: ['dist', '.next', 'out'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      nextPlugin.flatConfig.recommended,
      nextPlugin.flatConfig.coreWebVitals,
    ],
    settings: { react: { version: 'detect' } },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      'import/no-unresolved': 0,
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'type'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  configPrettier,
);
