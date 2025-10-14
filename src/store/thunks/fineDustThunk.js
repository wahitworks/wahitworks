import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import aixosFineDustConfig from '../../configs/axiosFineDustConfig';

const API_BASE_URL = "https://app12.green-meerkat.kro.kr/B552584/getMsrstnAcctoRltmMesureDnsty";

export const fetchFineDustData = createAsyncThunk(
  'fineDust/fetchFineDustData',
  async (stationName, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          serviceKey: decodeURIComponent(aixosFineDustConfig.SERVICE_KEY),
          stationName: stationName,
          dataTerm: "DAILY",
          returnType: "json",
          ver: "1.0",
        }
      });

      const items = response.data.response.body.items;

      if (items && items.length > 0) {
        console.log('미세먼지 api 응답 성공', items[0]);
        return items[0];
      } else {
        return rejectWithValue('해당 측정소의 데이터가 없습니다.');
      }
    } catch(error) {
      console.error('미세먼지 api 요청 실패', error);
      return rejectWithValue(error.response?.data || '알 수 없는 에러가 발생했습니다.');
    }
  }
);