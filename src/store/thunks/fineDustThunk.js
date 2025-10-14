import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosFineDustConfig from '../../configs/axiosFineDustConfig';
import axios from 'axios';

export const fetchFineDustData = createAsyncThunk(
  'fineDust/fetchFineDustData',
  async (payload, { rejectWithValue }) => {
    try {
      const stationName = typeof payload === 'string' ? payload : payload.stationName;
      const response = await axiosFineDustConfig.get('getMsrstnAcctoRltmMesureDnsty', {
        params: {
          serviceKey: axiosFineDustConfig.SERVICE_KEY,
          stationName: stationName,
          dataTerm: axiosFineDustConfig.DATA_TERM,
          returnType: axiosFineDustConfig.RETURN_TYPE,
          ver: axiosFineDustConfig.VER,
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