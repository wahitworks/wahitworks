import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAirConfig from "../../configs/axiosAirConfig";
import axios from "axios";

export const getCurrentAirCondition = createAsyncThunk(
  'currentAirCondition/getCurrentAirCondition',
  async(measuringStation, { rejectWithValue }) => {
    try {
      // const state = getState();
      // console.log('thunkAPI로 받아온 측정소:', state.locationSlice.measuringStation);

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
      return currentAir.data.response.body.items;
    } catch (error) {
      console.error("현재 대기 정보 가져오기 실패:", error);
      return rejectWithValue(error.message);
    }
  }

)