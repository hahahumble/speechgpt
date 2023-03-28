import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './reducer/global';

const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

export default store;
