import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosAirConfig from "../../configs/axiosAirConfig.js";

/**
 * 측정소를 기반으로 현재 대기 상태 받아오기
 * (measuringStation) : 측정소
 */
export const getCurrentAirCondition = createAsyncThunk(
  'currentAirCondition/getCurrentAirCondition',
  async(measuringStation, { rejectWithValue }) => {
    try {
      // const state = getState();
      // console.log('thunkAPI로 받아온 측정소:', state.locationSlice.measuringStation);

      // ============================================
      // ||     1. api 설정
      // ============================================
      const url = `${axiosAirConfig.BASE_URL}/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty`;
      const params = {
        serviceKey: axiosAirConfig.SERVICE_KEY,
        returnType: axiosAirConfig.RETURN_TYPE,
        numOfRows: axiosAirConfig.NUM_OF_ROWS,
        ver: axiosAirConfig.VER,
        dataTerm: axiosAirConfig.DATA_TERM,
        stationName: measuringStation,
      }
      const currentAir = await axios.get(url, { params });
      // console.log('Thunk에서 받아온 정보: ', currentAir.data.response.body);

      // ============================================
      // ||     반환!
      // ============================================
      return currentAir.data.response.body.items;

    } catch (error) {
      console.error("현재 대기 정보 가져오기 실패:", error);
      return rejectWithValue(error.message);
    }
  }

)