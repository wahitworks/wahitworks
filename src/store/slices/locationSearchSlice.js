import { createSlice } from "@reduxjs/toolkit";
import { localStorageUtil } from "../../utils/localStorageUtil.js";

const locationSearchSlice = createSlice({
  name: 'locationSearchSlice',
  initialState: {
    searchInput: '',
    searchKeyword: localStorageUtil.getSearchKeywordRegion() || null,
    filteredLocationList: [],
  },
  reducers: {
    setSearchInput(state, action) {
      state.searchInput = action.payload;
    },
    setSearchKeyword(state, action) {
      state.searchKeyword = action.payload;
    },
    setFilteredLocationList(state, action) {
      state.filteredLocationList = action.payload;
    }
  }
});

export const {
  setSearchInput,
  setSearchKeyword,
  setFilteredLocationList,
} = locationSearchSlice.actions;

export default locationSearchSlice.reducer;