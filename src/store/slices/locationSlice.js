import { createSlice } from "@reduxjs/toolkit";

import { getCurrentLocation, getSearchLocation } from "../thunks/locationThunk.js";
import { localStorageUtil } from "../../utils/localStorageUtil.js";

const locationSlice = createSlice({
  name: 'locationSlice',
  initialState: {
    // === 통합된 위치 정보 ===
    displayLocation: {
      name: '',
      lat: null,
      lng: null,
      source: null  // "gps" | "search" | null
    },
    // === 측정소 정보 ===
    measuringStation: '',
    measuringStationDistance: 0,
    // === 기타 ===
    error: null,
    selectedLocationByUser: null,
  },
  reducers: {
    setDisplayLocation(state, action) {
      state.displayLocation = action.payload;
    },
    setMeasuringStation(state, action) {
      state.measuringStation = action.payload;
    },
    setMeasuringStationDistance(state, action) {
      state.measuringStationDistance = action.payload;
    },
    setSelectedLocationByUser(state, action) {
      state.selectedLocationByUser = action.payload;
    },
    clearLocationError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
    // ============================================
    // ||     현재 위치로 주소 + 측정소 가져오기
    // ============================================
    .addCase(getCurrentLocation.pending, (state) => {
      state.error = null;
    })
    .addCase(getCurrentLocation.fulfilled, (state, action) => {
      // 통합된 위치 정보 저장
      state.displayLocation = action.payload.location;
      state.measuringStation = action.payload.nearestStation.stationName;
      state.measuringStationDistance = action.payload.nearestStation.distance;

      // 에러 정보 저장 (성공 시 null, 실패 시 { type, message })
      state.error = action.payload.error;

      // 로컬스토리지에 저장
      localStorageUtil.setLocationData({
        displayLocation: action.payload.location,
        measuringStation: action.payload.nearestStation.stationName
      });
    })

    // ============================================
    // ||     주소(검색어)로 측정소 가져오기
    // ============================================
    .addCase(getSearchLocation.pending, (state) => {
      state.error = null;
    })
    .addCase(getSearchLocation.fulfilled, (state, action) => {
      // 통합된 위치 정보 저장
      state.displayLocation = action.payload.location;
      state.measuringStation = action.payload.nearestStation.stationName;
      state.measuringStationDistance = action.payload.nearestStation.distance;

      // 로컬스토리지에 저장
      localStorageUtil.setLocationData({
        displayLocation: action.payload.location,
        measuringStation: action.payload.nearestStation.stationName
      });
    })

    // ============================================
    // ||     오류 처리
    // ============================================
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action) => {
        console.log('location Thunk 측정소 불러오기 실패', action.error);
      }
    )
  }
})

export const {
  setDisplayLocation,
  setMeasuringStation,
  setMeasuringStationDistance,
  setSelectedLocationByUser,
  clearLocationError,
} = locationSlice.actions;

export default locationSlice.reducer;