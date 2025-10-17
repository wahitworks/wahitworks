import { createAsyncThunk } from "@reduxjs/toolkit";
import { findNearestStation, getAddrFromGPS, getCurrentGPS, getLatLngFromAddr } from "../../utils/geoUtil.js";

/**
 * 현재 GPS 기반으로 주소 + 측정소 가져오기
 */
export const getCurrentLocation = createAsyncThunk(
  'locationSlice/getCurrentLocation',
  async(_, { rejectWithValue }) => {
    try {
      // ===== CASE.1 현재 위치를 가져올 수 없는 경우 =====
      if(!navigator.geolocation) {
        console.log('브라우저가 위치 정보를 지원하지 않습니다');
        return;
      }    
      
      // ===== CASE.2 현재 위치를 가져올 수 있는 경우 =====
      if(navigator.geolocation) {
        // 1. GPS로 위도 경도 가져오기
        const gps = await getCurrentGPS()
        // 2. 위도 경도로 주소 값 받기
        const gpsAddr = await getAddrFromGPS(gps.lng, gps.lat);
        //  3. 가져온 위도 경도 값으로 측정소 매칭 
        const gpsStation = findNearestStation(gps.lat, gps.lng);
        // console.log('측정소 찾기 완료 :', nearestStation);
        
      // ===== 반환 : { 현재GPS: {위도, 경도, 현재지역}, 가까운 측정소: {가까운 측정소 정보, 거리} }
        return {
          currentGPS: {
            lat: gps.lat,
            lng: gps.lng,
            currentRegion: gpsAddr,
          },
          nearestStation: gpsStation,
        };
      } 
    } catch (error) {
      console.error("위치정보 가져오기 실패 : ", error, '기본 값으로 설정합니다.');
      // ===== 주소 정보 대신, 기본 값 반환! =====
      return {
        currentGPS: {
          lat: 35.874465,
          lng: 128.584301,
          currentRegion: '중구 성내동',
        },
        nearestStation: {
          stationCode: 422114,
          stationName: "수창동",
          district: '중구',
          address: '중구 달성로 22길 30(수창초등학교 4층 옥상)',
          distance: 0,
        }
      };
    }
  }
)

/**
 * 검색한 주소 기반으로 측정소 가져오기
 * (searchKeyword) : "oo구 oo동" 형식의 주소
 */
export const getSearchLocation = createAsyncThunk(
  'searchLocationSlice/getSearchLocation',
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