import { createSlice } from "@reduxjs/toolkit";
import { setMatchedLocation } from "./locationSlice";

const locationSearchSlice = createSlice({
  name: 'locationSearchSlice',
  initialState: {
    searchInput: '',
    searchKeyword: null,
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