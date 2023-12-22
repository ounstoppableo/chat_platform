import '@/App.scss';
import routes from '@/router/routes.tsx';
import { ConfigProvider } from 'antd';
import { useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import wsContext from './context/wsContext.ts';

const router = createBrowserRouter(routes);

function App() {
  const ws = useContext(wsContext);
  useEffect(() => {
    ws.connect(
      `wss://${location.host}/local/chat?token=${
        localStorage.getItem('token') || ''
      }`
    );
    return () => ws.close();
  }, []);
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            paddingBlock: 4,
            paddingInline: 4,
            activeShadow: 'rgba(22, 119, 255,0.1)'
          },
          Button: {
            defaultBorderColor: 'rgba(22, 119, 255,0.5)',
            defaultColor: '#999'
          }
        },
        token: {
          colorTextPlaceholder: '#a8abb2',
          colorBgContainer: '#424654',
          colorText: 'white',
          colorBorder: 'black'
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
