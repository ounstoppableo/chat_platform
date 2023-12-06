import http from '../http';

// import fetchMock from 'jest-fetch-mock';
const responseData = { success: true, code: 200 };
// beforeEach(() => {
//   // if you have an existing `beforeEach` just add the following lines to it
//   fetchMock.mockIf(/^http:\/\/test.example.com/, async (req: any) => {
//     if (req.url.endsWith('/testPost')) {
//       return { body: JSON.stringify(responseData) };
//     }
//     if (req.url.endsWith('/testGet')) {
//       return { body: JSON.stringify(responseData) };
//     }
//     if (req.url.endsWith('/testNoCode')) {
//       return { body: JSON.stringify({ success: true }) };
//     } else return { status: 0 };
//   });
// });

beforeEach(() => {
  jest.spyOn(window, 'fetch').mockImplementation(async (config: any): Promise<any> => {
    if (/^http:\/\/test.example.com/.test(config.url)) {
      if (config.url.endsWith('/testPost')) {
        if (config.method === 'POST') {
          const response = {
            status: 200,
            clone: () => {
              return response
            }, json: () => {
              return {...responseData }
            }
          };
          return response
        }
      }
      if (config.url.endsWith('/testGet')) {
        if(config.method==='GET'){
          const response = {
            status: 200,
            clone: () => {
              return response
            }, json: () => {
              return {...responseData }
            }
          };
          return response
        }
      }
      if (config.url.endsWith('/testNoCode')) {
        const response = {
          status: 200,
          clone: () => {
            return response
          }, json: () => {
            return { success:true }
          }
        };
        return response
      } else return { status: 0 };
    }
  });
});

describe('测试http服务', () => {
  test('做一个成功的POST请求', async () => {
    const url = 'http://test.example.com/testPost';
    const data = { name: 'John', age: 18 };
    const result = await http(url, { method: 'POST', body: data });
    expect(result).toEqual(responseData);
  });
  test('做一个成功的GET请求', async () => {
    const url = 'http://test.example.com/testGet';
    const result = await http(url);
    expect(result).toEqual(responseData);
  });
  test('做没有返回code的请求', async () => {
    const url = 'http://test.example.com/testNoCode';
    const result = await http(url);
    expect(result).toEqual({ success: true });
  });
  test('做请求错误的请求', async () => {
    const url = 'http://test.example.com';
    const result = await http(url);
    expect(result).toEqual({ code: -1, data: false });
  });
});
