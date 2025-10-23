import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: 'headerSlice',
  initialState: {
    headerTitle: '중구 성내동',
    searchFlg: false,
    menuFlg: false,
    isTutorialVisible: false, // 튜토리얼 표시 여부
    showInstallModal: false, // PWA 설치 모달 표시 여부
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
    },
    setTutorialVisible(state, action) { // 튜토리얼 표시 여부 설정
      state.isTutorialVisible = action.payload;
    },
    setShowInstallModal(state, action) { // PWA 설치 모달 표시 여부 설정
      state.showInstallModal = action.payload;
    }
  }
});

export const {
  setHeaderTitle,
  setSearchFlg,
  setMenuFlg,
  setTutorialVisible, // action export 추가
  setShowInstallModal,
} = headerSlice.actions;

export default headerSlice.reducer;