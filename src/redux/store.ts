import { configureStore } from '@reduxjs/toolkit';
import testReducer from './testReducer/test';
import userInfoReducer from './userInfo/userInfo';

export default configureStore({
  reducer: {
    counter: testReducer,
    userInfo: userInfoReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});
