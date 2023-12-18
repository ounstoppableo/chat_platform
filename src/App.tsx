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
            paddingInline: 4
          }
        },
        token: {
          colorTextPlaceholder: '#a8abb2',
          colorText: 'white'
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
