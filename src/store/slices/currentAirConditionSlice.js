import { createSlice } from "@reduxjs/toolkit";
import { getCurrentAirCondition } from "../thunks/currentAirConditionThunk.js";

const currentAirConditionSlice = createSlice({
  name: 'currentAirCondition',
  initialState: {
    dataTime: '',
    currentPM10: 0,
    currentPM25: 0,
    currentO3: 0,
    currentNO2: 0,
    currentCO: 0,
    currentSO2: 0,
    page: 0,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
    // ============================================
    // ||     현재 대기 상태 가져오기
    // ============================================
    .addCase (getCurrentAirCondition.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase (getCurrentAirCondition.fulfilled, (state, action) => {
      const lastData = action.payload?.[action.payload.length - 1];
      if (lastData) {
        state.currentPM10 = lastData.pm10Value;
        state.currentPM25 = lastData.pm25Value;
        state.currentO3 = lastData.o3Value;
        state.currentNO2 = lastData.no2Value;
        state.currentCO = lastData.coValue;
        state.currentSO2 = lastData.so2Value;
        state.dataTime = lastData.dataTime;
      }
      // console.log(lastData);
      // console.log('미세먼지:', state.currentPM10, '초미세먼지:', state.currentPM25, '오존:', state.currentO3, '이산화질소:', state.currentNO2, '일산화탄소:', state.currentCO, '아황산가스:', state.currentSO2);
    })

    // ============================================
    // ||     오류 처리
    // ============================================
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action) => {
        console.log('현재 대기 정보 가져오기 실패 : ', action.error);
      }
    )
  }
})

export default currentAirConditionSlice.reducer;