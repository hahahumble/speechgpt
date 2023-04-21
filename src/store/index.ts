import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './reducer/global';
import sessionReducer from './reducer/session';

const store = configureStore({
  reducer: {
    global: globalReducer,
    session: sessionReducer,
  },
});

export default store;
