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

  
