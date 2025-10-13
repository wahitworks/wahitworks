import { createSlice } from "@reduxjs/toolkit";
import { fetchAirQuality } from "../thunks/airQualityThunk.js";

const initialState = {
  dailyForecasts: [], // Thunk로부터 받은 3일치 예보 데이터
  currentIndex: 0,    // 현재 보여주고 있는 날짜 인덱스 (0: 오늘, 1: 내일, 2: 모레)
  loading: false,     // 로딩 상태
  error: null,        // 에러 상태
};

const airQualitySlice = createSlice({
  name: "airQuality", // 슬라이스 이름
  initialState,
  reducers: {
    // 날짜 이동 리듀서
    nextDay(state) {
      if (state.currentIndex < state.dailyForecasts.length - 1) {
        state.currentIndex += 1;
      }
    },
    prevDay(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
  },
  // Thunk의 상태에 따라 자동으로 상태를 변경
  extraReducers: (builder) => {
    builder
      .addCase(fetchAirQuality.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirQuality.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyForecasts = action.payload; // Thunk가 반환한 데이터로 state 업데이트
        state.currentIndex = 0;
      })
      .addCase(fetchAirQuality.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { nextDay, prevDay } = airQualitySlice.actions;
export default airQualitySlice.reducer;