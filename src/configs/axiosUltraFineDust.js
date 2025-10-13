import axios from "axios";

//오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const API_BASE_URL = "https://app12.green-meerkat.kro.kr/B552584";
const API_KEY = "834qgh90a2304fj23985yfg2w3ryfci8g32trict6jni56";
const DEFAULT_PARAMS = {
  serviceKey: API_KEY,
  returnType: "json",
  searchDate: getTodayDate(), // 동적으로 오늘 날짜를 가져옴
};

const axiosUltraFineDust = axios.create({
  baseURL: API_BASE_URL,
  params: DEFAULT_PARAMS,
});

export default axiosUltraFineDust;
