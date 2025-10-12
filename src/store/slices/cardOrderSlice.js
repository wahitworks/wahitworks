import { loadCardOrder, saveCardOrder } from "../../utils/localStorageUtil";
import { createSlice } from "@reduxjs/toolkit";

// 기본 템플릿 순서 (상수)
// 현재 4개, 카드 추가시 수정 필요
const DEFAULT_ORDER = [1, 2, 3, 4];

const initialState = {
  order: loadCardOrder(DEFAULT_ORDER),
};

const cardOrderSlice = createSlice({
  name: "cardOrder",
  initialState, //DEFAULT_ORDER
  reducers: {
    setOrder(state, action) {
      state.order = action.payload;
      saveCardOrder(state.order);
    },
    resetOrder(state) {
      state.order = DEFAULT_ORDER; // 해당 리듀서 실행시 default 카드 순서로 변경 후 로컬 스토리지에 저장.
      saveCardOrder(state.order);
    },
  },
});

export const { setOrder, resetOrder } = cardOrderSlice.actions;
export default cardOrderSlice.reducer;
