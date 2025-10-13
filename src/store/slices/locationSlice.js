import { createSlice } from "@reduxjs/toolkit";

import { getCurrentLocation, getSearchLocation } from "../thunks/locationThunk.js";

const locationSlice = createSlice({
  name: 'locationSlice',
  initialState: {
    currentLocation: {lat: 0, lng: 0},
    currentRegion: '',
    matchedLocation: '',
    measuringStation: '',
    measuringStationDistance: 0,
    error: null,
  },
  reducers: {
    setCurrentLocation(state, action) {
      state.currentLocation = action.payload;
    },
    setMatchedLocation(state, action) {
      state.matchedLocation = action.payload;
    },
    setMeasuringStation(state, action) {
      state.measuringStation = action.payload;
    },
    setMeasuringStationDistance(state, action) {
      state.measuringStationDistance = action.payload;
    }
  },
  extraReducers: builder => {
    builder

    // 현재 위치로 주소 + 측정소 가져오기
    .addCase(getCurrentLocation.pending, (state) => {
      state.error = null;
    })
    .addCase(getCurrentLocation.fulfilled, (state, action) => {
      state.currentLocation = { lat: action.payload.currentGPS.lat, lng: action.payload.currentGPS.lng };
      state.currentRegion = action.payload.currentGPS.currentRegion;
      console.log('slice에서 담은 것: currentLocation-', state.currentLocation, 'currentRegion-', state.currentRegion);
      state.measuringStation = action.payload.nearestStation.stationName;
      state.measuringStationDistance = action.payload.nearestStation.distance;
      console.log('slice에서 담은 것: measuringStation-', state.measuringStation, 'measuringDistance-', state.measuringStationDistance);
    })

    // 주소로 측정소 가져오기
    .addCase(getSearchLocation.pending, (state) => {
      console.log('현재 주소로 측정소를 가져오고 있는 중...');
      state.error = null;
    })
    .addCase(getSearchLocation.fulfilled, (state, action) => {
      state.measuringStation = action.payload.nearestStation.stationName;
      state.measuringStationDistance = action.payload.nearestStation.distance;
      console.log('slice에서 담은 것: measuringStation-', state.measuringStation, 'measuringDistance-', state.measuringStationDistance);
    })

    // 오류 처리
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
  setMeasuringStation,
  setMeasuringStationDistance,
} = locationSlice.actions;

export default locationSlice.reducer;