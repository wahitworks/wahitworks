import { loadCardOrder, saveCardOrder } from "../../utils/localStorageUtil";
import { createSlice } from "@reduxjs/toolkit";

// 기본 템플릿 순서 (상수)
// 현재 4개, 카드 추가시 수정 필요
const DEFAULT_ORDER = [
  // 자유롭게 수정 부탁드립니다.
  { id: `card01`, name: "오늘의 행동요령", checked: true },
  { id: `card02`, name: "대구 대기질 3일 예보", checked: true },
  { id: `card03`, name: "지금 대기 상태", checked: true },
  { id: `card04`, name: "내 장소", checked: true },
  { id: `card05`, name: "대기질 등급 기준", checked: true },
  { id: `card06`, name: "시간대별 추세", checked: true },
];

const initialState = {
  order: loadCardOrder(DEFAULT_ORDER),
};

// console.log('초기 order:', initialState.order);

const cardOrderSlice = createSlice({
  name: "cardOrder",
  initialState, //DEFAULT_ORDER
  reducers: {
    // 카드 순서 변경
    setOrder(state, action) {
      state.order = action.payload;
      saveCardOrder(state.order); // localStorage에 즉시 저장
    },
    // 카드 순서 리셋
    resetOrder(state) {
      state.order = DEFAULT_ORDER; // 해당 리듀서 실행시 default 카드
      saveCardOrder(state.order); // localStorage에 즉시 저장
    },
    // 카드의 checked 상태 토글
    toggleCardVisibility: (state, action) => {
      const card = state.order.find((item) => item.id === action.payload);
      if (card) {
        card.checked = !card.checked;
        saveCardOrder(state.order); // localStorage에 즉시 저장
      }
    },
  },
});



export const { setOrder, resetOrder, toggleCardVisibility } =
  cardOrderSlice.actions;
export default cardOrderSlice.reducer;
