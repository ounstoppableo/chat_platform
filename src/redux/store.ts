import { configureStore } from '@reduxjs/toolkit';
import testReducer from './testReducer/test';

export default configureStore({
  reducer: {
    counter: testReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});
