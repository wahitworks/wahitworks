import { createSlice } from "@reduxjs/toolkit";

import { fetchFineDustData } from '../thunks/fineDustThunk';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const fineDustSlice = createSlice({
    name: 'fineDustSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchFineDustData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchFineDustData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchFineDustData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default fineDustSlice.reducer;