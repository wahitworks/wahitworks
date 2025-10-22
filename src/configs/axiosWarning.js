import axios from "axios";

//오늘 날짜를 YYYY 형식으로 반환
const getToYearDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  return `${yyyy}`;
};

const axiosWarning = axios.create({
  SERVICE_KEY: '834qgh90a2304fj23985yfg2w3ryfci8g32trict6jni56',
  BASE_URL: 'https://app12.green-meerkat.kro.kr/B552584',
  RETURN_TYPE: 'json',
  YEAR: getToYearDate(),
})

export default axiosWarning;