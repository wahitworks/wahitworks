import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCurrentLocation = createAsyncThunk(
  'locationSlice/getCurrenLocation',
  async() => {
    // 현재 위치를 가져올 수 없는 경우
    if(!navigator.geolocation) {
      console.log('브라우저가 위치 정보를 지원하지 않습니다');
      return;
    }    
    // 현재 위치를 가져올 수 있는 경우
    if(navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        // 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(resolve, reject);
      })

      const { latitude, longitude } = position.coords;
      console.log('현재 위치:', latitude, longitude);

      // ===== 카카오 SDK 사용해서 현재 위도&경도 주소 가져오기 (index.html에 스크립트 로드 필요) =====
      // 카카오 SDK의 Geocoder 객체 생성
      const geocoder = new window.kakao.maps.services.Geocoder();

      // Geocoder도 콜백 방식이라 Promise로 감싸서 await 사용 가능하게 만듦
      const addressData = await new Promise((resolve, reject) => {
        // coord2Address(경도, 위도, 콜백함수)
        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if(status === window.kakao.maps.services.Status.OK) {
            // 성공 시 result[0].address에 주소 정보가 담김
            resolve(result[0].address);
            console.log('카카오맵으로 가져온 주소:', result[0].address);
          } else {
            reject(new Error('주소를 가져올 수 없습니다'));
          }
        });
      });

      // "oo구 oo동" 형태로 추출
      const currentRegion = `${addressData.region_2depth_name} ${addressData.region_3depth_name}`;
      console.log('추출한 지역:', currentRegion);

      // 반환!
      return {
        lat: latitude,
        lng: longitude,
        currentRegion: currentRegion
      };
    }
  }
)