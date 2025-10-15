import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosFineDustConfig from '../../configs/axiosFineDustConfig.js';
import axios from 'axios';

export const fetchFineDustData = createAsyncThunk(
  'fineDust/fetchFineDustData',
  async (payload, { rejectWithValue }) => {
    const stationName = typeof payload === 'string' ? payload : payload.stationName;

    try {
      const response = await axiosFineDustConfig.get('getMsrstnAcctoRltmMesureDnsty', {
        params: {
          stationName: stationName, // 동적으로 변하는 stationName만 제공
        }
      });

      const items = response.data.response.body.items;

      if (items && items.length > 0) {
        return { stationName: stationName, data: items[0] };
      } else {
        const noDataError = 'API에서 해당 측정소 데이터를 제공하지 않습니다.';
        return rejectWithValue({ stationName: stationName, error: noDataError });
      }
    } catch(error) {
      // axios 에러 객체를 분석하여 더 구체적인 에러 메시지를 생성합니다.
      let errorMsg = '알 수 없는 에러가 발생했습니다.';
      if (error.response) {
        // 서버응답완, 상태 코드가 200번대 밖
        errorMsg = `서버 응답 에러: ${error.response.status}`;
        console.error(`'${stationName}' 서버 에러 상세:`, error.response.data);
      } else if (error.request) {
        errorMsg = '네트워크 에러: 서버에서 응답이 없습니다.';
      } else {
        // 요청을 설정하는 중에 에러가 발생한 경우
        errorMsg = `요청 설정 에러: ${error.message}`;
      }
      console.error(`'${stationName}' Thunk 에러:`, error);
      return rejectWithValue({ stationName: stationName, error: errorMsg });
    }
  }
); 