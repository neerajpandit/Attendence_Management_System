import { combineReducers } from '@reduxjs/toolkit';
import loadingSlice from './slices/loadingSlice';
import userDetailsSlice from './slices/userDetailsSlice';

const rootReducer = combineReducers({
  loadingSlice: loadingSlice,
  userDetailsSlice: userDetailsSlice,
});

export default rootReducer;
