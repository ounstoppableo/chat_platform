### 项目介绍

本项目旨在搭建一个聊天平台，初步考虑使用websocket技术进行及时通信以及消息共享

技术栈构想是：react（前端）+nodejs（后端）

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

#### 为项目添加scss适配

~~~sh
# 直接下载sass就可以使用
pnpm i sass -D
~~~

配置全局变量

~~~ts
export default defineConfig({
    css: {
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        // 文件路径，注意最后需要添加 ';'
        additionalData: '@import "@/globalVariable.scss";',
        javascriptEnabled: true
      }
    }
  }
})
~~~

#### 为项目添加tailwindcss

> tailwindcss提供了许多css的原子类，我们可以通过在html标签内添加属性来引用它们，不必再去一一定义各种类，大大减少了开发成本

~~~sh
pnpm install -D tailwindcss@latest postcss@latest autoprefixer@latest
~~~

~~~sh
npx init tailwindcss
~~~

~~~js
//tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,js,tsx,jsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
~~~

~~~tsx
//main.tsx
import 'tailwindcss/tailwind.css';
~~~

~~~ts
//vite.config.ts
export default {
  css: {
     postcss: {
         //tailwindcss获取各种预定义类
         //autoprefixer自动匹配浏览器前缀
        plugins: [require('tailwindcss'), require('autoprefixer')]
     }
  }
}
~~~

#### 添加react依赖

##### 添加react-router

~~~sh
# 下载依赖
pnpm install react-router-dom localforage match-sorter sort-by
~~~

~~~tsx
import '@/App.scss';
import routes from '@/routes.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
~~~

~~~tsx
//routes.tsx
export default [
  {
    path: '/',
    element: <div>Hello world!</div>
  }
];
~~~

##### 添加redux

~~~sh
# 安装依赖
pnpm install redux @reduxjs/toolkit react-redux
pnpm install --save-dev redux-devtools
~~~

~~~tsx
//main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import 'tailwindcss/tailwind.css';
import '@/index.scss';
import store from '@/redux/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
~~~

~~~tsx
//store.ts
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
  reducer: {}
});
~~~

###### 举一个使用例子

~~~ts
//testReducer.ts
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
      // 并不是真正的改变状态值，因为它使用了 Immer 库
      // 可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的
      // 不可变的状态
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
~~~

~~~ts
//store.ts
import { configureStore } from '@reduxjs/toolkit';
import testReducer from './testReducer/test';

export default configureStore({
  reducer: {
      //添加reducer
    counter: testReducer
  }
});
~~~

~~~tsx
//test.tsx
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '@/redux/testReducer/test';

export default function Counter() {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
~~~

#### 集成ant-design



#### 自动化测试

> 一个完备的项目，进行测试是非常重要的

首先我们需要明确前端有几个测试流程：

- 单元测试（Unit Test）

  即对最小可测试单元进行测试，在前端可以细化到对一个模块进行测试，比如react项目中，可能是对某个tsx文件进行测试

  不过我们需要保证被测试的文件/组件是低耦合的，这也从另一方面保证了我们项目的质量

  > 一个测试代码，一般是以`given-when-then`的形式进行构建的，比如：
  >
  > ~~~ts
  > type TProduct = {
  >   name: string
  >   price: number
  > }
  > // production code
  > const computeTotalAmount = (products: TProduct[]) => {
  >   return products.reduce((total, product) => total + product.price, 0)
  > }
  > 
  > // testing code
  > it('should return summed up total amount 1000 when there are three products priced 200, 300, 500', () => {
  >   // given - 准备数据
  >   const products = [
  >     { name: 'nike', price: 200 },
  >     { name: 'adidas', price: 300 },
  >     { name: 'lining', price: 500 }
  >   ]
  > 
  >   // when - 调用被测函数
  >   const result = computeTotalAmount(products)
  > 
  >   // then - 断言结果
  >   expect(result).toBe(1000)
  > })
  > ~~~

  一个好的单元测试应该有的特点：

  - 只关注输入输出，不关注内部实现
  - 只测一条分支
  - 表达力强
  - 不包含逻辑
  - 运行速度快

- 集成测试（Integration Test）

  集成测试即某些联合的功能块完成后，进行一个联合测试，在前端可能可以比喻成一个页面中，所有组件都写好了，那么我们就测试组件构成的这个页面

  集成测试不比单元测试，集成测试用的更多的是在耦合度较高的代码中：经过二次封装的函数/组件、多个函数/组件组合而成的函数/组件

- UI测试（UI Test）

  主要就是图文交互测试，看产品是否符合设计稿

- 端到端测试（e2e）

  端到端测试则是最直观的测试了，不管代码如何实现，就管其在浏览器的页面上进行的操作是否符合预期，即代码端->浏览器端

  流行的端到端测试框架：

  - Cypress(推荐)
  - nightwatch
  - webdriverIO
  - playwright

  ![](.\image\QQ截图20231203142217.png)

##### 测试最佳实践

###### 金字塔模型

google的自动化测试分层比例是（金字塔模型）：

- 单元测试（70%）（速度快）
- 接口测试（20%）
- UI测试/E2E测试（10%）（速度慢）

###### 奖杯模型

奖杯模式是由kent C.Dodds提出：

- 静态测试（eslint/ts编码时的语法规范）
- 单元测试（jest）
- 集成测试（jest）
- e2e测试（cypress）

这个结构是根据测试所反馈给编码者的自信心来进行划分的，越上层（静态->e2e方向）带来的自信心越大，越底层测试效率更高

###### 适用场景

- 纯代码函数库：大量的单元+少量集成
- 组件库：大量代码+快照+少量集成+端到端测试
- 业务系统：大量集成+单元+少量端到端

##### 单元测试

> 单元测试，这里我用的是jest

如何配置vite+react的测试环境？

我们首先需要安装两类依赖：

- jest（由于vite+typescript中配置babel太过冗余，所以选择ts-jest替代babel）
- RTL(react test library)：`@testing-library/jest-dom`、`@testing-library/react`、`@testing-library/user-event`

~~~sh
# 安装依赖 jest ts-jest需要保持大版本一致 比如27对27
pnpm i -D jest @types/jest ts-node ts-jest @testing-library/react @testing-library/user-event identity-obj-proxy @testing-library/jest-dom @types/testing-library__jest-dom jest-environment-jsdom
~~~

~~~sh
# 生成jest.config.ts文件，因为这里没有适用babel，所以选择v8
npx jest --init
~~~

~~~json
//package.json文件
{
	"scripts": {
		"test":"jest --config ./jest.config.ts"
	}
}
~~~

~~~ts
//jest.config.ts文件
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  //测试代码前执行的环境
  //此时jestframework还没有搭建，即使用不了test、describe这些函数
  setupFiles: ['./test/setup.js', 'jest-canvas-mock'],
  //此时jestframework已经搭建，可以使用test、describe这些函数了
  setupFilesAfterEnv: ['./test/setupAfterEnv.ts'],
    
  //测试时忽略的文件
  testPathIgnorePatterns: ['/node_modules/'],

  //遇到tsx结尾的文件转用ts-jest进行测试
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  
  //一些别名配置，即匹配到这些正则后去给出的文件获取数据
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
      //这个表示一个虚拟代理
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
      //为了搭配我们项目中@别名能找到src下的文件，正则$1表示获取([^\\.]*)的匹配结果，[^\\.]表示除\和.之外的字符
    '@/([^\\.]*)$': '<rootDir>/src/$1'
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',

    //覆盖忽略
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

  coverageProvider: 'v8',

    //这个必须为jsdom，因为要测试dom环境
  testEnvironment: 'jsdom',

    //测试路径，设置后就只执行该路径下的测试文件
  testMatch: ['**/src/__tests__/**/*.[jt]s?(x)']
};

export default config;
~~~

~~~ts
//setup.js文件
//下面这个语句非常重要，关系到setupFilesAfterEnv这个环境是否能使用es6语法
Object.defineProperty(window, 'TextEncoder', {
  writable: true,
  value: util.TextEncoder
});
Object.defineProperty(window, 'TextDecoder', {
  writable: true,
  value: util.TextDecoder
});
~~~

~~~ts
//setupAfterEnv.ts文件
//以下是setupAfterEnv的一个使用例子，enableMocks的作用是能在jest环境模拟fetch的使用，这个语句就是让fetch能在所有test函数中使用
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
~~~

###### 一个例子

~~~tsx
//以之前的一个测试页面写的测试文件
import { render } from '@testing-library/react';
import TestView from '@/view/testView/test';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import user from '@testing-library/user-event';

test('点击测试完成', async () => {
  const { container } = render(
    <Provider store={store}>
      <TestView />
    </Provider>
  );
  const incrementButton = await container.querySelector(
    '[aria-label="Increment value"]'
  );
  const decrementButton = await container.querySelector(
    '[aria-label="Decrement value"]'
  );
    
  //模拟加减按钮操作
  const span = await container.querySelector('span');
  expect(span?.innerHTML).toBe('0');
  await user.click(incrementButton as any);
  expect(span?.innerHTML).toBe('1');
  await user.click(decrementButton as any);
  expect(span?.innerHTML).toBe('0');
});
~~~

#### 遇到的小坑

##### flex布局下的单行文字省略问题

以下代码预想的效果：
![](.\image\QQ截图20231217155504.png)

然而真实效果：

![](.\image\QQ截图20231217155654.png)

把22222删除：

![](.\image\QQ截图20231217155848.png)

我们可以直观的看到，22222引起了盒子的变化，里面的内容把其他内容给撑开了，但是头像和日期的宽度明明是写死的，为什么撑开后宽度会消失呢？这或许是tailwind的bug

先不说那个，明明我已经将flex-1给了中间的区域，也就是说中间区域是有宽度的，按理说子内容不应该撑开才对，然而事实却是撑开了

后来我找到解决办法，内容影响外部布局那就把盒子变成BFC就行了，加上overflow:hidden即可解决，但是令人疑惑的一个点就是，明明flex布局也可以形成BFC，为什么却没起作用

~~~react
<div className="tw-flex tw-flex-col tw-gap-3">
      <div className="tw-h-16 tw-rounded-lg tw-bg-chatRelationActive tw-flex tw-p-3 tw-gap-3 tw-items-center">
        <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden">
          <img
            src="http://8.130.54.105/assets/avatar.jpeg"
            alt=""
            className="tw-w-full tw-h-full tw-object-contain"
          />
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col">
            <!-- no-wrap-ellipsis表示基本的单行文字省略效果 -->
          <div className="no-wrap-ellipsis">全员总群</div>
          <div className="no-wrap-ellipsis tw-text-textGrayColor tw-text-xs">
            22222222222222222222222222222222222222222222222222222222222
          </div>
        </div>
        <div className="tw-w-14 tw-text-textGrayColor tw-text-xs tw-flex tw-items-center">
          12月04日
        </div>
      </div>
</div>
~~~

##### 文本换行

我们以前用中文充当文本基本都会进行换行，但是使用英文或者数字的时候换行就出现了问题

倘若我们输入一长串数字/字母，中间没有任何空格或标点符号，那么文本就不会自动换行，它会被判断为完整的单词，不会被拆分

但是这种情况不是我们想要的，如果它超出限定的宽度，我们的UI会被破坏，如何解决呢？

~~~css
/* 这样就可以实现单词未结束，超过宽度强制换行 */
overflow-wrap: break-word;
~~~

但还有一个问题，我们通常需要文字宽度自适应，因为我们不知道实际的文本宽度到底有多宽，如何做呢?

~~~css
/* 宽度自适应文本 */
width: fit-content;
/* 设置最大宽度，达到则换行 */
max-width: 100%;
~~~

##### 滚动条小坑

当我们使用justify-content:flex-end的时候overflow:auto会失效

#### 待做事项

- [ ] 静态页面搭建

- [ ] 发表情操作
- [ ] 发图片操作
- [ ] 发文件操作
- [ ] 用户、消息懒加载
- [ ] 新消息提醒
- [ ] 已读、未读功能

