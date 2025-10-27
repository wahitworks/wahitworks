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
 * @param {number} timeout - 최대 대기 시간 (ms), 기본값 10000ms (10초)
 * @returns {Promise<void>}
 */
function waitForKakao(timeout = 10000) {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 즉시 반환
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      // console.log('✅ 카카오맵 SDK 이미 로드됨');
      resolve();
      return;
    }

    console.log('⏳ 카카오맵 SDK 로딩 대기 중...');
    // console.log('현재 상태:', {
    //   kakao: !!window.kakao,
    //   maps: !!(window.kakao?.maps),
    //   services: !!(window.kakao?.maps?.services)
    // });

    const startTime = Date.now();

    const interval = setInterval(() => {
      // 디버깅: 현재 상태 출력
      const currentState = {
        kakao: !!window.kakao,
        maps: !!(window.kakao?.maps),
        services: !!(window.kakao?.maps?.services)
      };
      // console.log('체크 중...', currentState);

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
        console.error('최종 상태:', currentState);
        console.error('window.kakao 전체:', window.kakao);
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
    console.error('위도 경도 정보가 없습니다.');
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
  * @throws {Error} PERMISSION_DENIED - 위치 권한이 거절된 경우
  * @throws {Error} POSITION_UNAVAILABLE - 위치를 사용할 수 없는 경우
  * @throws {Error} TIMEOUT - 위치 요청 시간 초과
  */
export async function getCurrentGPS() {
  // 1. Permissions API로 권한 상태 미리 확인 (지원하는 브라우저만)
  if (navigator.permissions) {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });

      console.log('📍 위치 권한 상태:', permission.state);

      // 권한이 거절된 상태 - 사용자가 브라우저 설정에서 변경해야 함
      if (permission.state === 'denied') {
        throw new Error('PERMISSION_DENIED');
      }

      // permission.state === 'granted' 또는 'prompt'인 경우 계속 진행
      
      // 권한이 거절 -> error 처리
    } catch (error) {
      if (error.message === 'PERMISSION_DENIED') {
        throw error;
      }
      // Permissions API를 지원하지 않는 브라우저는 그냥 진행
      console.error('⚠️ Permissions API 미지원, geolocation API로 직접 시도');
    }
  }

  // 2. 위치 정보 요청 (콜백 방식 -> Promise로 변환)
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      // getCurrentPosition(resolve, reject, optoion)
      // 1. resolve
      resolve,
      // 2. reject
      (error) => {
        // 에러 코드에 따라 다른 메시지로 reject
        if (error.code === error.PERMISSION_DENIED) {
          console.error('❌ 위치 권한 거절됨');
          reject(new Error('PERMISSION_DENIED'));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          console.error('❌ 위치 정보를 사용할 수 없음');
          reject(new Error('POSITION_UNAVAILABLE'));
        } else if (error.code === error.TIMEOUT) {
          console.error('❌ 위치 요청 시간 초과');
          reject(new Error('TIMEOUT'));
        } else {
          console.error('❌ 알 수 없는 위치 오류:', error);
          reject(error);
        }
      },
      // 3. option
      {
        enableHighAccuracy: false,  // 정확도 vs 속도/배터리를 선택하는 옵션
                                      // true: GPS 사용 → 정확하지만 느리고 배터리 많이 씀
                                      // false: WiFi/네트워크 기반 → 덜 정확하지만 빠르고 배터리 적게 씀
        timeout: 10000,             // 요청시간 최대 10초
        maximumAge: 60000           // 60초 이내 캐시 허용 -> 재요청 시 60초 이내라면 캐시 사용
      }
    );
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
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
