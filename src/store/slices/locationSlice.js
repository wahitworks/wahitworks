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
    // regionStationMap: {}, // region, station 매핑 객체
    error: null,
    selectedLocationByUser: null,
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
    },
    setSelectedLocationByUser(state, action) {
      state.selectedLocationByUser = action.payload;
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
      state.currentLocation = { lat: action.payload.currentGPS.lat, lng: action.payload.currentGPS.lng };
      state.currentRegion = action.payload.currentGPS.currentRegion;
      // console.log('GPS slice에서 담은 것: currentLocation-', state.currentLocation, 'currentRegion-', state.currentRegion);
      state.measuringStation = action.payload.nearestStation.stationName;
      state.measuringStationDistance = action.payload.nearestStation.distance;
      // console.log('GPS slice에서 담은 것: measuringStation-', state.measuringStation, 'measuringDistance-', state.measuringStationDistance);
    })

    // ============================================
    // ||     주소(검색어)로 측정소 가져오기
    // ============================================
    .addCase(getSearchLocation.pending, (state) => {
      // console.log('현재 주소로 측정소를 가져오고 있는 중...');
      state.error = null;
    })
    .addCase(getSearchLocation.fulfilled, (state, action) => {
      state.measuringStation = action.payload.nearestStation.stationName;
      state.measuringStationDistance = action.payload.nearestStation.distance;
      // console
      // 검색한 지역(action.meta.arg-thunk에서 자동으로 입력된 값)을 key로, 찾은 측정소 이름을 value로 저장
      // if (action.meta.arg && action.payload.nearestStation) {
      //   state.regionStationMap[action.meta.arg] = action.payload.nearestStation.stationName;
      //   console.log('regionStationMap :', state.regionStationMap[action.meta.arg], 'action.payload에서 가져온 측정소 이름 :', action.payload.nearestStation.stationName)
      // }
      console.log('검색 slice에서 담은 것: measuringStation-', state.measuringStation, 'measuringDistance-', state.measuringStationDistance);
    })

    // ============================================
    // ||     오류 처리
    // ============================================
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
  setSelectedLocationByUser,
} = locationSlice.actions;

export default locationSlice.reducer;