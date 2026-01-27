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
      '**/node_modules',
      '**/__tests__',
      '**/iconfont'
    ]
  },

  { files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'] },

  { languageOptions: { globals: globals.browser } },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended, // React 推荐规则（flat 版）
  pluginReact.configs.flat['jsx-runtime'], // 如果用 React 17+ 的新 JSX Transform

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
      // 你原来的自定义规则放这里
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off'
      // ...
    },
    settings: {
      react: { version: 'detect' }
    }
  }
);
