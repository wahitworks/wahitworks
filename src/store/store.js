import { configureStore } from "@reduxjs/toolkit";

import headerReducer from './slices/headerSlice.js';
import locationSearchReducer from './slices/locationSearchSlice.js';
import locationReducer from './slices/locationSlice.js';
import bookmarkReducer from './slices/bookmarkSlice.js';

export default configureStore({
  reducer: {
    headerSlice : headerReducer,
    locationSearchSlice : locationSearchReducer,
    locationSlice : locationReducer,
    bookmarkSlice : bookmarkReducer,
  }
});