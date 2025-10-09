import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: 'headerSlice',
  initialState: {
    headerTitle: '중구 삼덕동',
    searchFlg: false,
    menuFlg: false,
  },
  reducers: {
    setHeaderTitle(state, action) {
      state.headerTitle = action.payload;
    },
    setSearchFlg(state, action) {
      state.searchFlg = action.payload;
    },
    setMenuFlg(state, action) {
      state.menuFlg = action.payload;
    }
  }
});

export const {
  setHeaderTitle,
  setSearchFlg,
  setMenuFlg,
} = headerSlice.actions;

export default headerSlice.reducer;