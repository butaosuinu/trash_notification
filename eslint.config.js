import love from 'eslint-config-love';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import oxlint from 'eslint-plugin-oxlint';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'out/', '*.config.*'],
  },
  {
    ...love,
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ...love.languageOptions,
      parserOptions: {
        ...love.languageOptions?.parserOptions,
        projectService: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      ...love.plugins,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...love.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
        },
      ],
      '@typescript-eslint/prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: true,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      complexity: ['error', { max: 15 }],
    },
  },
  {
    files: ['src/constants/**/*.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
  {
    files: ['src/renderer/src/components/**/*.tsx'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  ...oxlint.configs['flat/recommended'],
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      '@typescript-eslint/no-magic-numbers': 'off',
      'max-lines-per-function': 'off',
      'unicorn/no-useless-undefined': 'off',
    },
  },
];
