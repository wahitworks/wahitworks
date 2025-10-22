import { createSlice } from "@reduxjs/toolkit";
import { getWarning } from '../thunks/warningThunk';

const warningSlice = createSlice({
  name: 'warning',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWarning.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarning.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // 성공 시, 받아온 데이터를 state에 저장
      })
      .addCase(getWarning.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // 실패 시, 에러 메시지를 state에 저장
      })
  }

})

export default warningSlice.reducer;