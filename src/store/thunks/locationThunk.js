import { createAsyncThunk } from "@reduxjs/toolkit";
import { findNearestStation } from "../../utils/geoUtil.js";

/**
 * 현재 GPS 기반으로 주소 + 측정소 가져오기
 */
export const getCurrentLocation = createAsyncThunk(
  'locationSlice/getCurrentLocation',
  async(_, { rejectWithValue }) => {
    try {
      // ==============================================
      // ||    현재 위치를 가져올 수 없는 경우
      // ==============================================
      if(!navigator.geolocation) {
        console.log('브라우저가 위치 정보를 지원하지 않습니다');
        return;
      }    
      
      // ==============================================
      // ||    현재 위치를 가져올 수 있는 경우
      // ==============================================
      if(navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
        // ============================================
        // ||     1. 현재 위치 가져오기 
        // ============================================
          navigator.geolocation.getCurrentPosition(resolve, reject);
        })
        
        const { latitude, longitude } = position.coords;
        // console.log('현재 위치:', latitude, longitude);
        
        // ============================================
        // ||     2. 현재 위도&경도 주소 가져오기 (카카오 SDK 사용 : index.html에 스크립트 로드 필요)
        // ============================================
        // 카카오 SDK의 Geocoder 객체 생성
        const geocoder = new window.kakao.maps.services.Geocoder();
        // Geocoder도 콜백 방식이라 Promise로 감싸서 await 사용 가능하게 만듦
        const addressData = await new Promise((resolve, reject) => {
          // coord2Address(경도, 위도, 콜백함수)
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if(status === window.kakao.maps.services.Status.OK) {
              // 성공 시 result[0].address에 주소 정보가 담김
              resolve(result[0].address);
              // console.log('카카오맵으로 가져온 주소:', result[0].address);
            } else {
              reject(new Error('주소를 가져올 수 없습니다'));
            }
          });
        });
        // "oo구 oo동" 형태로 추출
        const currentRegion = `${addressData.region_2depth_name} ${addressData.region_3depth_name}`;
        // console.log('추출한 지역:', currentRegion);
        
        // ============================================
        // ||     3. 가져온 위도 경도 값으로 측정소 매칭 
        // ============================================
        const nearestStation = findNearestStation(latitude, longitude);
        // console.log('측정소 찾기 완료 :', nearestStation);
        
      // ==============================================
      // ||    반환 { 현재GPS: {위도, 경도, 현재지역}, 가까운 측정소: {가까운 측정소 정보, 거리} }
      // ==============================================
        return {
          currentGPS: {
            lat: latitude,
            lng: longitude,
            currentRegion: currentRegion,
          },
          nearestStation: nearestStation,
        };
      } 
    } catch (error) {
      console.error("위치정보 가져오기 실패 : ", error, '기본 값으로 설정합니다.');
      // ==============================================
      // ||    주소 정보 대신, 기본 값 반환!
      // ==============================================
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
        // ============================================
        // ||     1. 키워드로 위도&경도 가져오기 (카카오 SDK 사용 : index.html에 스크립트 로드 필요)
        // ============================================
      // 카카오 객체 생성
      const geocoder = new window.kakao.maps.services.Geocoder();
      // 비동기이므로 promise로 감싸서 await
      const searchCoordinates = await new Promise((resolve, reject) => {
        // console.log(`대구 ${searchKeyword}`)
        geocoder.addressSearch(`대구 ${searchKeyword}`, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve ({
              lat : parseFloat(result[0].y),
              lng : parseFloat(result[0].x),
            });
          } else {
            reject(new Error('주소로 좌표를 찾을 수 없습니다.'));
          }
        });
      });
      
      // console.log('좌표 변환 : ', searchCoordinates);
      
      // ============================================
      // ||     2. 가져온 위도&경도로 가까운 측정소 찾기
      // ============================================
      const nearestStation = findNearestStation(searchCoordinates.lat, searchCoordinates.lng)
      // console.log('좌표로 측정소 찾기 : ', nearestStation);
      
      // ============================================
      // ||     반환 { 검색주소: {위도, 경도}, 가까운 측정소: {측정소 정보, 거리} }
      // ============================================
      // console.log(`대구 ${searchKeyword} : lat-`, searchCoordinates.lat, 'lng - ', searchCoordinates.lng)
      return {
        searchLocation: {
          lat: searchCoordinates.lat,
          lng: searchCoordinates.lng,
        },
        nearestStation: nearestStation,
      }
    } catch (error) {
      console.error("주소로 측정소 가져오기 실패:", error);
      return rejectWithValue(error.message);
    }
  }
)