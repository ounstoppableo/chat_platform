import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import '@/utils.scss';
import '@/index.scss';
import '@/theme.scss';
import store from '@/redux/store';
import { Provider } from 'react-redux';
import WebSocketService from './utils/ws';
import wsContext from './context/wsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <wsContext.Provider value={new WebSocketService()}>
        <App />
      </wsContext.Provider>
    </Provider>
  </React.StrictMode>
);
