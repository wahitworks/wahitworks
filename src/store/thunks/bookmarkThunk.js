import { createAsyncThunk } from "@reduxjs/toolkit";
import { findNearestStation, getLatLngFromAddr } from "../../utils/geoUtil.js";

/**
 * 검색한 주소 기반으로 측정소 가져오기
 * (searchKeyword) : "oo구 oo동" 형식의 주소
 */
export const getSearchLocationForBookmark = createAsyncThunk(
  'bookmarkSlice/getSearchLocationForBookmark',
  async (searchKeyword, { rejectWithValue }) => {
    try {
      // 1. 키워드로 위도&경도 가져오기
      const keywordCoordinates = await getLatLngFromAddr(searchKeyword);
      // console.log('검색어로 좌표 변환 : ', keywordCoordinates);
      
      // 2. 가져온 위도&경도로 가까운 측정소 찾기
      const keywordStation = findNearestStation(keywordCoordinates.lat, keywordCoordinates.lng)
      // console.log('좌표로 측정소 찾기 : ', keywordStation);
      
      // ===== 반환 : { 검색주소: {위도, 경도}, 가까운 측정소: {측정소 정보, 거리} }
      return {
        searchLocation: {
          lat: keywordCoordinates.lat,
          lng: keywordCoordinates.lng,
        },
        nearestStation: keywordStation,
      }
    } catch (error) {
      console.error("주소로 측정소 가져오기 실패:", error);
      return rejectWithValue(error.message);
    }
  }
)