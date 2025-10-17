import { createSlice } from "@reduxjs/toolkit";
import { localStorageUtil } from "../../utils/localStorageUtil.js";
import { getSearchLocationForBookmark } from "../thunks/bookmarkThunk.js";

const bookmarkSlice = createSlice({
  name: 'bookmarkSlice',
  initialState: {
    bookmarkedRegions: localStorageUtil.getBookmarkedRegions() || [],
    bookmarkSearchInput: '',
    bookmarkSearchKeyword: null,
    bookmarkSearchRegion:'',
    bookmarkSearchMeasuringStation: '',
    bookmarkFilteredList: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ===== 검색 기능 =====
    // 입력어 설정
    setBookmarkSearchInput(state, action) {
      state.bookmarkSearchInput = action.payload;
    },
    // 검색어 설정
    setBookmarkSearchKeyword(state, action) {
      state.bookmarkSearchKeyword = action.payload;
    },
    // 입력어에 따른 자동완성 리스트
    setBookmarkFilteredList(state, action) {
      state.bookmarkFilteredList = action.payload;
    },
    // ===== 북마크 기능 =====
    // 북마크에 추가
    addBookmark(state, action) {
      state.bookmarkedRegions.push(action.payload);
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },
    // 북마크에서 제거
    removeBookmark(state, action) {
      state.bookmarkedRegions = state.bookmarkedRegions.filter(item => item.region !== action.payload);
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },
    updateBookmarkedRegions(state, action) {
      state.bookmarkedRegions = action.payload;
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },
    // 저장하기 버튼 순서 저장
    saveBookmarkOrder(state, action) {
      state.bookmarkedRegions = action.payload;
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },
  },
  extraReducers: builder => {
    builder
    .addCase(getSearchLocationForBookmark.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSearchLocationForBookmark.fulfilled, (state, action) =>{
      state.bookmarkSearchMeasuringStation = action.payload.nearestStation.stationName; // 가까운 측정소
      // console.log('북마크 슬라이스 측정소:', state.bookmarkSearchMeasuringStation);
      state.loading = false;
      state.error = null;
    })
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        console.log('현재 대기 정보 가져오기 실패 : ', action.error);
      }
    )
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