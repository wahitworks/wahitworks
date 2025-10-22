import { createSlice } from "@reduxjs/toolkit";
import { getCurrentAirCondition } from "../thunks/currentAirConditionThunk.js";

const currentAirConditionSlice = createSlice({
  name: 'currentAirCondition',
  initialState: {
    dataTime: 0,
    currentPM10: 0,
    currentPM25: 0,
    currentO3: 0,
    currentNO2: 0,
    currentCO: 0,
    currentSO2: 0,
    pm10Flag: null,
    pm25Flag: null,
    o3Flag: null,
    no2Flag: null,
    coFlag: null,
    so2Flag: null,

    page: 0,

    loading: true,
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
      if (lastData && lastData.dataTime) {
        // 모든 데이터 먼저 채우기
        state.currentPM10 = lastData.pm10Value;
        state.currentPM25 = lastData.pm25Value;
        state.currentO3 = lastData.o3Value;
        state.currentNO2 = lastData.no2Value;
        state.currentCO = lastData.coValue;
        state.currentSO2 = lastData.so2Value;
        state.dataTime = lastData.dataTime;

        state.pm10Flag = lastData.pm10Flag;
        state.pm25Flag = lastData.pm25Flag;
        state.o3Flag = lastData.o3Flag;
        state.so2Flag = lastData.so2Flag;
        state.coFlag = lastData.coFlag;
        state.no2Flag = lastData.no2Flag;

        state.error = null;

        // 모든 데이터가 다 채워진 후 마지막에 loading을 false로 변경
        state.loading = false;
      } else {
        // 데이터가 없으면 loading은 false로
        state.loading = false;
        state.error = null;
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
        state.loading = false;
        state.error = action.error.message || '데이터를 불러오는데 실패했습니다.';
        console.log('현재 대기 정보 가져오기 실패 : ', action.error);
      }
    )
  }
})

export default currentAirConditionSlice.reducer;