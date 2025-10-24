import { createSlice } from "@reduxjs/toolkit";
import { localStorageUtil } from "../../utils/localStorageUtil.js";
import { getSearchLocationForBookmark } from "../thunks/bookmarkThunk.js";

const bookmarkSlice = createSlice({
  name: 'bookmarkSlice',
  initialState: {
    bookmarkedRegions: localStorageUtil.getBookmarkedRegions() || [],
    loading: false,
    error: null,
  },
  reducers: {
    // ===== 검색 기능 =====
    // 입력어 설정
    setBookmarkSearchInput(state, action) {
      state.bookmarkSearchInput = action.payload;
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
    
    // 북마크 전체 업데이트 (저장 버튼 클릭 시 호출됨)
    updateBookmarkedRegions(state, action) {
      // localStorage 저장은 saveBookmarkOrder에서 수행하므로 여기서는 Redux만 업데이트
      state.bookmarkedRegions = action.payload;
    },
    // 저장하기 버튼 - 현재 state를 localStorage에 저장
    saveBookmarkOrder(state) {
      // payload 없이 현재 state만 localStorage에 저장
      localStorageUtil.setBookmarkedRegions(state.bookmarkedRegions);
    },

    // 북마크 닉네임 변경
    updateBookmarkNickname(state, action) {
      const { region, nickname } = action.payload;
      const item = state.bookmarkedRegions.find(item => item.region === region);
      if (item) {
        item.nickname = nickname;
      }
      // localStorage도 업데이트
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
        console.error('현재 북마크 저장하기 위한 측정소 정보 가져오기 실패 : ', action.error);
      }
    )
  }
})

export const {
  addBookmark,
  removeBookmark,

  updateBookmarkedRegions,
  saveBookmarkOrder,

  updateBookmarkNickname,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;