import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosWarning from "../../configs/axiosWarning";
import axios from "axios";

export const getWarning = createAsyncThunk(
  'warning/getWarning',
  async(payload, { rejectWithValue }) => {
    try {
      const url = `${axiosWarning.BASE_URL}/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo`;
      const params ={
        serviceKey: axiosWarning.SERVICE_KEY,
        returnType: axiosWarning.RETURN_TYPE,
        year: axiosWarning.YEAR,
      }
      const response = await axios.get(url, { params });

      if (response.data && response.data.response && response.data.response.body && response.data.response.body.items) {
        return response.data.response.body.items;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)