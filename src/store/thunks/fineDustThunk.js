import { createAsyncThunk } from '@reduxjs/toolkit';
import aixosFineDustConfig from '../../configs/axiosFineDustConfig';
import axios from 'axios';

export const fetchFineDustData = createAsyncThunk(
  'fineDust/fetchFineDustData',
  async (stationName, { rejectWithValue }) => {
    try {
      const response = await aixosFineDustConfig.get('', {
        params: {
          serviceKey: aixosFineDustConfig.SERVICE_KEY,
          stationName: stationName,
          dataTerm: aixosFineDustConfig.DATA_TERM,
          returnType: aixosFineDustConfig.RETURN_TYPE,
          ver: aixosFineDustConfig.VER,
        }
      })
      const items = response.data.response.body;

      if (items && items.lenth > 0) {
        console.log('미세먼지 api 응답 성공', items[0]);
        return items[0];
      } else {
        return rejectWithValue('해당 측정소의 데이터가 없습니다.');
      } 
    } catch(error) {
      console.log('미세먼지 api 요청 실패', error);
      return rejectWithValue(error.response.data || '에러');
    }
  }
);