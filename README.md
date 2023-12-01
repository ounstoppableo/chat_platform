### 项目介绍

本项目旨在搭建一个聊天平台，初步考虑使用websocket技术进行及时通信以及消息共享

### 项目搭建

#### 搭建之初

> 为项目配置代码规范

🌈为项目添加eslint+prettier+commitlint+husky

- 项目配置eslint

  ~~~sh
  #一键安装所有依赖并生成配置文件
  npm init @eslint/config
  ~~~

- 项目配置prettier

  ~~~sh
  pnpm i prettier -D
  ~~~

  ~~~js
  //prettier.cjs
  module.exports = {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      singleQuote: true,
      semi: false,
      trailingComma: "none",
      bracketSpacing: true
  }
  ~~~

- 配置eslint+prettier兼容依赖

  ~~~sh
  pnpm i eslint-config-prettier eslint-plugin-prettier -D
  ~~~

  ~~~js
  //配置你的eslintrc.cjs文件
  module.exports = {
      "env": {
          "browser": true,
          "es2021": true
      },
      "extends": [
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:react/recommended",
  +       "plugin:prettier/recommended"
      ],
      "overrides": [
          {
              "env": {
                  "node": true
              },
              "files": [
                  ".eslintrc.{js,cjs}"
              ],
              "parserOptions": {
                  "sourceType": "script"
              }
          }
      ],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
          "ecmaVersion": "latest",
          "sourceType": "module"
      },
      "plugins": [
          "@typescript-eslint",
          "react",
  +       "prettier"
      ],
      "rules": {
  +       "prettier/prettier": "error",
  +       "arrow-body-style": "off",
  +       "prefer-arrow-callback": "off"
      }
  }
  ~~~

  ~~~json
  //配置package.json文件
  "script": {
       "lint": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./",
  }
  ~~~

  <font style="color:red">这个时候可能会有以下报错：</font>error  'React' must be in scope when using JSX  react/react-in-jsx-scope

  只需修改：

  ~~~js
  //.eslintrc.cjs
      "rules": {
          "prettier/prettier": "error",
          "arrow-body-style": "off",
          "prefer-arrow-callback": "off",
  +       "react/react-in-jsx-scope": "off",
  +       "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx",".ts",".tsx"] }],
      }
  ~~~

- vite中引入eslint

  > 以便在开发环境发现问题，即在vite构建时会根据错误进行相应的提示，而不需要我们手动去pnpm lint

  ~~~sh
  pnpm i vite-plugin-eslint -D
  ~~~

  ~~~js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  + import viteEslint from 'vite-plugin-eslint'
  
  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [
      react(),
  +   viteEslint({
  +     failOnError: true
  +   })
    ]
  })
  ~~~

- 配置husky

  ~~~sh
  pnpm i husky -D
  ~~~

  ~~~sh
  # 配置package.json的script
  pnpm pkg set scripts.prepare="husky install"
  # 执行刚刚配置的script,为项目安装husky
  pnpm run prepare
  ~~~

  ~~~sh
  # 将lint的script添加到husky中
  npx husky add .husky/pre-commit "pnpm run lint"
  ~~~

- 配置commitlint

  ~~~sh
  pnpm i @commitlint/cli @commitlint/config-conventional -D
  ~~~

  ~~~js
  // commitlint.config.js
  const fs = require('fs');
  const path = require('path');
  const { execSync } = require('child_process');
  
  const scopes = fs
    .readdirSync(path.resolve(__dirname, 'src'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name.replace(/s$/, ''));
  
  // precomputed scope
  const scopeComplete = execSync('git status --porcelain || true')
    .toString()
    .trim()
    .split('\n')
    .find((r) => ~r.indexOf('M  src'))
    ?.replace(/(\/)/g, '%%')
    ?.match(/src%%((\w|-)*)/)?.[1]
    ?.replace(/s$/, '');
  
  /** @type {import('cz-git').UserConfig} */
  module.exports = {
    ignores: [(commit) => commit.includes('init')],
    extends: ['@commitlint/config-conventional'],
    rules: {
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [1, 'always'],
      'header-max-length': [2, 'always', 108],
      'subject-empty': [2, 'never'],
      'type-empty': [2, 'never'],
      'subject-case': [0],
      'type-enum': [
        2,
        'always',
        [
          'feat',
          'fix',
          'perf',
          'style',
          'docs',
          'test',
          'refactor',
          'build',
          'ci',
          'chore',
          'revert',
          'wip',
          'workflow',
          'types',
          'release',
        ],
      ],
    },
    prompt: {
      /** @use `yarn commit :f` */
      alias: {
        f: 'docs: fix typos',
        r: 'docs: update README',
        s: 'style: update code format',
        b: 'build: bump dependencies',
        c: 'chore: update config',
      },
      customScopesAlign: !scopeComplete ? 'top' : 'bottom',
      defaultScope: scopeComplete,
      scopes: [...scopes, 'mock'],
      allowEmptyIssuePrefixs: true,
      allowCustomIssuePrefixs: true,
      messages: {
        type: '选择你要提交的类型 :',
        scope: '选择一个提交范围（可选）:',
        customScope: '请输入自定义的提交范围 :',
        subject: '填写简短精炼的变更描述 :\n',
        body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
        breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
        footerPrefixsSelect: '选择关联issue前缀（可选）:',
        customFooterPrefixs: '输入自定义issue前缀 :',
        footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
        confirmCommit: '是否提交或修改commit ?',
      },
      types: [
        { value: 'feat', name: 'feat:      ✨ 新增功能 | A new feature', emoji: ':sparkles:' },
        { value: 'fix', name: 'fix:       🐛 修复缺陷 | A bug fix', emoji: ':bug:' },
        {
          value: 'docs',
          name: 'docs:      📝 文档更新 | Documentation only changes',
          emoji: ':memo:',
        },
        {
          value: 'style',
          name: 'style:     💄 代码格式 | Changes that do not affect the meaning of the code',
          emoji: ':lipstick:',
        },
        {
          value: 'refactor',
          name: 'refactor:  ♻️  代码重构 | A code change that neither fixes a bug nor adds a feature',
          emoji: ':recycle:',
        },
        {
          value: 'perf',
          name: 'perf:      ⚡️ 性能提升 | A code change that improves performance',
          emoji: ':zap:',
        },
        {
          value: 'test',
          name: 'test:      ✅ 测试相关 | Adding missing tests or correcting existing tests',
          emoji: ':white_check_mark:',
        },
        {
          value: 'build',
          name: 'build:     📦️ 构建相关 | Changes that affect the build system or external dependencies',
          emoji: ':package:',
        },
        {
          value: 'ci',
          name: 'ci:        🎡 持续集成 | Changes to our CI configuration files and scripts',
          emoji: ':ferris_wheel:',
        },
        { value: 'revert', name: 'revert:    🔨 回退代码 | Revert to a commit', emoji: ':hammer:' },
        {
          value: 'chore',
          name: 'chore:     ⏪️ 其他修改 | Other changes that do not modify src or test files',
          emoji: ':rewind:',
        },
      ],
      useEmoji: true,
      emojiAlign: 'center',
      themeColorCode: '',
      allowCustomScopes: true,
      allowEmptyScopes: true,
      customScopesAlias: 'custom',
      emptyScopesAlias: 'empty',
      upperCaseSubject: false,
      markBreakingChangeMode: false,
      allowBreakingChanges: ['feat', 'fix'],
      breaklineNumber: 100,
      breaklineChar: '|',
      skipQuestions: [],
      issuePrefixs: [
        // 如果使用 gitee 作为开发管理
        { value: 'link', name: 'link:     链接 ISSUES 进行中' },
        { value: 'closed', name: 'closed:   标记 ISSUES 已完成' },
      ],
      customIssuePrefixsAlign: 'top',
      emptyIssuePrefixsAlias: 'skip',
      customIssuePrefixsAlias: 'custom',
      confirmColorize: true,
      maxHeaderLength: Infinity,
      maxSubjectLength: Infinity,
      minSubjectLength: 0,
      scopeOverrides: undefined,
      defaultBody: '',
      defaultIssues: '',
      defaultSubject: '',
    },
  };
  ~~~

  ~~~sh
  # 将commitlint指令加入husky中
  npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
  ~~~


#### 添加react依赖

##### 添加react-router



##### 添加redux

