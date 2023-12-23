import '@/App.scss';
import routes from '@/router/routes.tsx';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes);

function App() {
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
          colorBorder: '#424654',
          colorTextDisabled: '#a8abb2',
          colorBgContainerDisabled: '#424654'
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
