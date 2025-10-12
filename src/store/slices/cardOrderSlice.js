import { loadCardOrder, saveCardOrder } from "../../utils/localStorageUtil";
import { createSlice } from "@reduxjs/toolkit";

// 기본 템플릿 순서 (상수)
// 현재 4개, 카드 추가시 수정 필요
const DEFAULT_ORDER = [
  {id: `card01`, checked: true},
  {id: `card02`, checked: true}, 
  {id: `card03`, checked: true}, 
  {id: `card04`, checked: true}
];

const initialState = {
  order: loadCardOrder(DEFAULT_ORDER),
};

const cardOrderSlice = createSlice({
  name: "cardOrder",
  initialState, //DEFAULT_ORDER
  reducers: {
    // 카드 순서 변경
    setOrder(state, action) {
      state.order = action.payload;
      // saveCardOrder(state.order); // 수동저장에 불필요
    },
    // 카드 순서 리셋
    resetOrder(state) {
      state.order = DEFAULT_ORDER; // 해당 리듀서 실행시 default 카드 순서로 변경 후 로컬 스토리지에 저장.
      // saveCardOrder(state.order); // 수동리셋에 불필요
    },
    // 카드의 checked 상태 토들
    toggleCardVisibility: (state, action) => {
      const card = state.order.find((item) => item.id === action.payload);
      if (card) {
        card.checked = !card.checked;
      }
    }
  },
});

export const { setOrder, resetOrder, toggleCardVisibility } = cardOrderSlice.actions;
export default cardOrderSlice.reducer;
