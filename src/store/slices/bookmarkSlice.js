import { createSlice } from "@reduxjs/toolkit";
import { localStorageUtil } from "../../utils/localStorageUtil.js";

const bookmarkSlice = createSlice({
  name: 'bookmarkSlice',
  initialState: {
    bookmarkedRegions: localStorageUtil.getBookmarkedRegions() || [],
    bookmarkSearchInput: '',
    bookmarkSearchKeyword: null,
    bookmarkFilteredList: [],
  },
  reducers: {
    addBookmark(state, action) {
      state.bookmarkedRegions.push(action.payload);
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },
    removeBookmark(state, action) {
      state.bookmarkedRegions = state.bookmarkedRegions.filter(item => item !== action.payload);
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },    
    setBookmarkSearchInput(state, action) {
      state.bookmarkSearchInput = action.payload;
    },
    setBookmarkSearchKeyword(state, action) {
      state.bookmarkSearchKeyword = action.payload;
    },
    setBookmarkFilteredList(state, action) {
      state.bookmarkFilteredList = action.payload;
    },
  }
})

export const {
  addBookmark,
  removeBookmark,
  setBookmarkSearchInput,
  setBookmarkSearchKeyword,
  setBookmarkFilteredList,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;