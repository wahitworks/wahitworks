import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosWeatherConfig, { weatherConfigParams } from "../../configs/axiosWeatherConfig.js";

export const fetchDaeguTodayWeather = createAsyncThunk(
  "weather/fetchDaeguTodayWeather",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosWeatherConfig.get("", { params: weatherConfigParams });
      const data = response.data.hourly;
      if (!data) return rejectWithValue("데이터 없음");

      // 현재 시간 인덱스 계산
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      let todayIndex = data.time.findIndex((t) => t.includes(`${todayStr}T00:00`));
      if (todayIndex === -1) {
        todayIndex = 0; // fallback to the start of the array if today's data is not found
      }
      const idx = todayIndex + now.getHours();

      // 구름량 기반 날씨 설명
      const cloudCover = data.cloud_cover[idx];
      let weatherDesc = "맑음";
      if (cloudCover >= 85) weatherDesc = "흐림";
      else if (cloudCover >= 60) weatherDesc = "구름 많음";
      else if (cloudCover >= 20) weatherDesc = "구름 조금";

      // 최종 반환 데이터
      return {
        temperature: data.temperature_2m[idx],
        rainProb: data.precipitation_probability[idx],
        cloudCover,
        weatherDesc,
        time: data.time[idx],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);