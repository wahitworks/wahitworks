import { createSlice } from "@reduxjs/toolkit";

import { fetchFineDustData } from '../thunks/fineDustThunk';

const initialState = {
    data: {},
    loading: {},
    error: {},
};

const fineDustSlice = createSlice({
    name: 'fineDustSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchFineDustData.pending, (state, action) => {
            const stationName = typeof action.meta.arg === 'string' ? action.meta.arg : action.meta.arg.stationName;
            state.loading[stationName] = true;
            state.error[stationName] = null;
        })
        .addCase(fetchFineDustData.fulfilled, (state, action) => {
            // action.payload는 { stationName, data } 형태가 됨
            const { stationName, data } = action.payload;
            // const { stationName, data: fetchedData } = action.payload; // state.data 와 충돌 방지
            state.loading[stationName] = false;
            state.data[stationName] = data;
            state.error[stationName] = null;
        })
        .addCase(fetchFineDustData.rejected, (state, action) => {
            // action.payload는 { stationName, error }형태
            // action.payload가 존재, stationName 확인
            if(action.payload && action.payload.stationNme) {
                const { stationName, error } = action.payload;
                state.loading[stationName] = false;
                state.error[stationName] = error;
                state.data[stationName] = null; // 에러 발생시 초기화
            } else {
                // payload에 stationName이 없는 경우
                const stationName = 
                typeof action.meta.arg === 'string' ? action.meta.arg : action.meta.arg.stationName;
                state.loading[stationName] = false;
                state.error[stationName] = action.error.message || 'Unknown error';
                state.data[stationName] = null;
                }   
        })
    },
});

export default fineDustSlice.reducer;