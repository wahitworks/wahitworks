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
    updateBookmarkedRegions(state, action) {
      state.bookmarkedRegions = action.payload;
      // localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },
    // 저장하기 버튼 순서 저장
    saveBookmarkOrder(state) {
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },
  }
})

export const {
  addBookmark,
  removeBookmark,
  setBookmarkSearchInput,
  setBookmarkSearchKeyword,
  setBookmarkFilteredList,
  updateBookmarkedRegions,
  saveBookmarkOrder,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;