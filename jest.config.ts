//jest.config.ts文件
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
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
