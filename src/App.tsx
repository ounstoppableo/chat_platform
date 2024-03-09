import '@/App.scss';
import routes from '@/router/routes.tsx';
import { ConfigProvider, message } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes);

function App() {
  message.config({
    maxCount: 1
  });
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
      <div id="imgOpenOverlay">
        <div className="imgOpenContainer">
          <img src="" alt="" id="fullScreenImage" />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
