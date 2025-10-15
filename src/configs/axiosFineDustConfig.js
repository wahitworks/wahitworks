// 미세 먼지 현황
import axios from "axios";

const API_BASE_URL = "https://app12.green-meerkat.kro.kr/B552584/ArpltnInforInqireSvc";
const API_KEY = "834qgh90a2304fj23985yfg2w3ryfci8g32trict6jni56";

const axiosFineDustConfig = axios.create({
  baseURL: API_BASE_URL,
  params: {
    serviceKey: API_KEY,
    dataTerm: "DAILY",
    ver: "1.5",
    numOfRows: "48",
    returnType: "json"
  }
})

export default axiosFineDustConfig;
