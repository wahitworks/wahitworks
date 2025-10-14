import { configureStore } from "@reduxjs/toolkit";

import headerReducer from "./slices/headerSlice.js";
import locationSearchReducer from "./slices/locationSearchSlice.js";
import locationReducer from "./slices/locationSlice.js";
import bookmarkReducer from "./slices/bookmarkSlice.js";

import cardOrderReducer from "./slices/cardOrderSlice.js";
import airQualityReducer from "./slices/airQualitySlice.js";
export default configureStore({
  reducer: {
    headerSlice: headerReducer,
    locationSearchSlice: locationSearchReducer,
    locationSlice: locationReducer,
    bookmarkSlice: bookmarkReducer,
    cardOrder: cardOrderReducer,
    airQuality: airQualityReducer,
    import currentAirConditionReducer from "./slices/currentAirConditionSlice.js";
    import fineDustReducer from "./slices/fineDustSlice.js";
  },
});
