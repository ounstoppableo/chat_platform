import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import '@/utils.scss';
import '@/index.scss';
import '@/theme.scss';
import store from '@/redux/store';
import { Provider } from 'react-redux';
import webSocketService from './ws/ws';
import wsContext from './context/wsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <wsContext.Provider value={webSocketService}>
      <Provider store={store}>
        <App />
      </Provider>
    </wsContext.Provider>
  </React.StrictMode>
);
