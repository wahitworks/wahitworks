import { createSlice } from "@reduxjs/toolkit";
import { getLatestAirCondition } from "../thunks/latestAirConditionThunk.js";

const latestAirCondition = createSlice({
  name: 'latestAirCondition',
  initialState: {
    pm10ValueList: [],
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
    .addCase(getLatestAirCondition.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getLatestAirCondition.fulfilled, (state, action) => {
      state.pm10ValueList = action.payload
        ? action.payload.map(data => ({
            dataTime: data.dataTime,
            pm10: data.pm10Value,
            pm10Grade: data.pm10Grade,
            pm25: data.pm25Value,
            pm25Grade: data.pm25Grade,
          }))
        : [];

      state.loading = false;
      state.error = null;
    })

    // ============================================
    // ||     오류 처리
    // ============================================
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || '미세먼지 추세 데이터 불러오기 실패';
        console.log('미세먼지 추세 데이터 불러오기 실패', action.error);
      }
    )
  }
})

export default latestAirCondition.reducer;