import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['docs/**', 'dist/**', 'coverage/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        beforeEach: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        describe: 'readonly',
        document: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        spyOn: 'readonly',
        window: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
];
