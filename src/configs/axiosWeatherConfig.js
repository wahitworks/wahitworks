import axios from "axios";

export const weatherConfigParams = {
  latitude: 35.8714,   // 대구 위도
  longitude: 128.6014, // 대구 경도
  hourly: "temperature_2m,precipitation_probability,cloud_cover",
  timezone: "Asia/Seoul",
};

const axiosWeatherConfig = axios.create({
  baseURL: "https://api.open-meteo.com/v1/forecast",
  timeout: 10000,
});

export default axiosWeatherConfig;