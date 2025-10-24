import { MEASURING_STATIONS } from "../constants/measuringStation.js";

// =================================================================
// ||    0. 카카오맵 SDK 로딩 대기 함수
// ||    1. 좌표(위도, 경도)로 거리 계산 함수
// ||    2. 각도를 라디안으로 변환하는 함수
// ||    3. 좌표(위도, 경도)로 가장 가까운 거리의 측정소를 찾는 함수
// ||    4. GPS로 위도, 경도 받는 함수
// ||    5. 주소로 위도, 경도 받는 함수
// ||    6. 위도, 경도로 주소 구하는 함수
// =================================================================

/**
 * 카카오맵 SDK가 로드될 때까지 대기하는 함수
 * @param {number} timeout - 최대 대기 시간 (ms), 기본값 20000ms (20초)
 * @returns {Promise<void>}
 */
function waitForKakao(timeout = 20000) {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 즉시 반환
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      console.log('✅ 카카오맵 SDK 이미 로드됨');
      resolve();
      return;
    }

    console.log('⏳ 카카오맵 SDK 로딩 대기 중...');
    const startTime = Date.now();

    const interval = setInterval(() => {
      // SDK 로드 완료 확인
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        clearInterval(interval);
        console.log('✅ 카카오맵 SDK 로드 완료');
        resolve();
      }
      // 타임아웃 체크
      else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        console.error('❌ 카카오맵 SDK 로딩 타임아웃');
        reject(new Error('카카오맵 SDK 로딩 타임아웃'));
      }
    }, 100); // 100ms마다 체크
  });
}

/**
 * haversine공식을 사용,
 * 위도, 경도 값으로 거리(km)를 계산하는 함수
 * @param {number} lat1 지점 1 위도
 * @param {number} lon1 지점 1 경도
 * @param {number} lat2 지점 2 위도
 * @param {number} lon2 지점 2 경도
 * @returns {number} 두 지점 사이의 거리 (km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = degreeToRadian(lat2 - lat1);
  const dLon = degreeToRadian(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreeToRadian(lat1)) * Math.cos(degreeToRadian(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 거리 (km)
  return distance;
}

/**
 * 각도를 라디안으로 변환하는 함수
 * @param {number} deg 변환할 각도
 * @returns {number} 라디안 값
 */
function degreeToRadian(deg) {
  return deg * (Math.PI / 180);
}

/**
 * 현재 위도, 경도를 기준으로 가장 가까운 측정소를 찾는 함수
 * @param {number} currentLat 위도
 * @param {number} currentLng 경도
 * @returns {object} 가장 가까운 측정소 정보 객체
 */
export function findNearestStation(currentLat, currentLng) {
  // 현재 위도 경도 값이 없을 경우, null 반환
  if (currentLat === null || currentLng === null) {
    console.log('위도 경도 정보가 없습니다.');
    return null;
  }

  let nearestStation = null;
  let minDistance = Infinity;

  MEASURING_STATIONS.forEach(station => {
    // 현재 위도 경도와 측정소의 거리계산
    const distance = calculateDistance(
      currentLat,
      currentLng,
      station.coordinates.dmY,
      station.coordinates.dmX,
    );
    // 가장 짧은 거리 찾고 측정소로 저장
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    };
  })
  
  // 가장 가까운 측정소 정보에 거리 담아서 반환
  return {
    ...nearestStation,
    distance: Number(minDistance.toFixed(2)),
  };
}

 /**
  * 브라우저의 GPS 기능으로 현재 위치를 가져오는 함수
  */
export async function getCurrentGPS() {
  // navigator.geolocation.getCurrentPosition은 콜백 방식
  // -> 값 받기 위해 promise 사용
  // -> async + await 사용
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
  return {  // ✅ 값을 반환해야 함!
    lat: position.coords.latitude,
    lng: position.coords.longitude
  }
}

/**
 * 주소 값으로 위도와 경도 구하는 함수
 * @param {string} addr : 위도, 경도 구할 주소
 */
export async function getLatLngFromAddr(addr) {
  // 카카오맵 SDK 로딩 대기
  await waitForKakao();

  // 카카오 객체 생성
  const geocoder = new window.kakao.maps.services.Geocoder();
  // 비동기이므로 promise로 감싸서 await
  const searchCoordinates = await new Promise((resolve, reject) => {
        // console.log(`대구 ${searchKeyword}`)
    geocoder.addressSearch(`대구 ${addr}`, (result, status) => {
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
  return searchCoordinates;
}

/**
 * 경도, 위도 받아서 현재 주소 출력
 * @param {number} longitude
 * @param {number} latitude
 */
export async function getAddrFromGPS(longitude, latitude) {
  // 카카오맵 SDK 로딩 대기
  await waitForKakao();

  // 카카오 SDK의 Geocoder 객체 생성
  const geocoder = new window.kakao.maps.services.Geocoder();
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
  })
  return `${addressData.region_2depth_name} ${addressData.region_3depth_name}`;
}
