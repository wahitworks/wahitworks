import { createSlice } from "@reduxjs/toolkit";
import { fetchDaeguTodayWeather } from "../thunks/weatherThunk.js";

const initialState = {
  data: null,       // 날씨 데이터 저장
  loading: false,   // 로딩 여부
  error: null,      // 에러 메시지
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // 필요 시 수동 초기화용 액션
    clearWeather: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDaeguTodayWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDaeguTodayWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDaeguTodayWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "날씨 데이터를 불러오지 못했습니다.";
      });
  },
});

export const { clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;