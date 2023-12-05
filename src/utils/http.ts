import getToken from './getToken';
import { message } from 'antd';
const initConfig = (config?: requestConfig) => {
  const headers = new Headers();
  if (config) {
    config.method = config.method || 'GET';
    config.headers = config.headers || headers;
    config.mode = config.mode || 'cors';
    config.credentials = config.credentials || 'include';
    //添加token
    config.headers.append('Authorization', getToken() || '');
    if (config.method === 'POST' || config.method === 'PUT') {
      config.headers.append('Content-Type', 'application/json; charset=utf-8');
    }
    return config;
  } else {
    return {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      credentials: 'include'
    };
  }
};
const checkStatus = (res: any) => {
  if (200 >= res.status && res.status < 300) {
    return res;
  }
  message.error(`服务器出错！${res.status}`);
  throw new Error(res.statusText);
};
const handleError = (error: any) => {
  if (error instanceof TypeError) {
    message.error(`网络请求失败啦！${error}`);
  }
  return {
    //防止页面崩溃，因为每个接口都有判断res.code以及data
    code: -1,
    data: false
  };
};
const judgeOkState = async (res: any) => {
  const cloneRes = await res.clone().json();
  //TODO:可以在这里管控全局请求
  if (!!cloneRes.code && cloneRes.code !== 200) {
    message.error(`11${cloneRes.msg}${cloneRes.code}`);
  }
  return cloneRes;
};
type requestConfig = {
  method?: 'POST' | 'GET' | 'DELETE' | 'PUT';
  body?: any;
  headers?: any;
  mode?: any;
  credentials?: any;
};
const http = (url: string, config?: requestConfig) => {
  //初始化配置项
  const hadInitConfig = initConfig(config);
  const requestConfig = new Request(url, hadInitConfig as any);
  return fetch(requestConfig)
    .then(checkStatus)
    .then(judgeOkState)
    .catch(handleError);
};

export default http;
