import { createSlice } from "@reduxjs/toolkit";

import { getSearchLocation } from "../thunks/locationThunk.js";

const bookmarkCard04 = createSlice({
  name: 'bookmarkCard04',
  initialState: {
    regionStationMap: {}, // region, station 매핑 객체
    loading: false,
  },
  extraReducers: builder => {
    builder
    .addCase(getSearchLocation.pending, state => {
      state.loading = true
    })
    .addCase(getSearchLocation.fulfilled, (state, action) => {
      // 검색한 지역(action.meta.arg-thunk에서 자동으로 입력된 값)을 key로, 찾은 측정소 이름을 value로 저장
      if (action.meta.arg && action.payload.nearestStation) {
        state.regionStationMap[action.meta.arg] = action.payload.nearestStation.stationName;
        console.log('regionStationMap :', state.regionStationMap[action.meta.arg], 'action.payload에서 가져온 측정소 이름 :', action.payload.nearestStation.stationName)
      }
    })
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action) => {
        console.log('내 장소의 측정소 가져오기 실패 : ', action.payload);
        // 특정 지역 검색 실패 시, 맵에 에러 상태 저장
        if (action.meta.arg) {
          state.regionStationMap[action.meta.arg] = 'error';
        }
      }
    )
  }
})

export default bookmarkCard04.reducer;