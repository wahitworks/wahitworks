import { createSlice } from "@reduxjs/toolkit";

import { getCurrentLocation } from "../thunks/locationThunk.js";

const locationSlice = createSlice({
  name: 'locationSlice',
  initialState: {
    currentLocation: {lat: 0, lng: 0},
    currentRegion: '',
    matchedLocation: '',
    measuringStation: '',
    error: null,
  },
  reducers: {
    setCurrentLocation(state, action) {
      state.currentLocation = action.payload;
    },
    setMatchedLocation(state, action) {
      state.matchedLocation = action.payload;
    }
  },
  extraReducers: builder => {
    builder
    .addCase(getCurrentLocation.pending, state => {
      console.log('getCurrentLocation 실행중...');
    })
    .addCase(getCurrentLocation.fulfilled, (state, action) => {
      state.currentLocation = { lat: action.payload.lat, lng: action.payload.lng };
      state.currentRegion = action.payload.currentRegion;
      console.log('slice에서 담은 것: currentLocation-', state.currentLocation, 'currentRegion-', state.currentRegion);
    })
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action) => {
        console.log('thunk함수 실패', action.error);
      }
    )
  }
})

export const {
  setCurrentLocation,
  setMatchedLocation,
} = locationSlice.actions;

export default locationSlice.reducer;