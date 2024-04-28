import '@/App.scss';
import routes from '@/router/routes.tsx';
import { ConfigProvider, message } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import smallSizeContext from './context/smallSizeContext';
import { useState } from 'react';

const router = createBrowserRouter(routes);

function App() {
  message.config({
    maxCount: 1
  });
  const [smallSize, setSmallSize] = useState(innerWidth < 1024 ? true : false);

  return (
    <smallSizeContext.Provider value={{ smallSize, setSmallSize }}>
      <ConfigProvider>
        <RouterProvider router={router} />
        <div id="imgOpenOverlay">
          <div className="imgOpenContainer">
            <img src="" alt="" id="fullScreenImage" />
          </div>
        </div>
      </ConfigProvider>
    </smallSizeContext.Provider>
  );
}

export default App;
