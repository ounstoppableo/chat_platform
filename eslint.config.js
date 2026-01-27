// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: [
      '**/.git',
      '**/.svn',
      '**/.hg',
      'node_modules',
      '**/__tests__/**',
      '**/iconfont/**',
      'dist',
      '.commitlintrc.cjs',
      '.prettierrc.cjs',
      'eslint.config.js',
      'test'
    ]
  },

  { files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'] },

  { languageOptions: { globals: globals.browser } },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],

  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: 'VARIABLE_NAME' }
      ],
      '@typescript-eslint/no-explicit-any': ['off'],
      'consistent-return': 'error',
      'react/no-unknown-property': ['off'],
      '@typescript-eslint/no-unused-expressions': 'off',
      'react-hooks/exhaustive-deps': 'off'
      // ...
    },
    settings: {
      react: { version: 'detect' }
    }
  }
);
