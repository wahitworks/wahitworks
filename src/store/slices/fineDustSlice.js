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
            const { stationName, data: fetchedData } = action.payload; // state.data 와 충돌 방지
            state.loading[stationName] = false;
            state.data[stationName] = fetchedData;
            state.error[stationName] = null;
        })
        .addCase(fetchFineDustData.rejected, (state, action) => {
            const { stationName, error: fetchedError } = action.payload; // state.error 와 충돌 방지
            state.loading[stationName] = false;
            state.error[stationName] = fetchedError;
            state.data[stationName] = null; // 에러 발생시 초기화
        });
    },
});

export default fineDustSlice.reducer;