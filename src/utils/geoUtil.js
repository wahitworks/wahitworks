import { MEASURING_STATIONS } from "../constants/measuringStation.js";

// =================================================================
// ||    1. 좌표(위도, 경도)로 거리 계산 함수
// ||    2. 각도를 라디안으로 변환하는 함수
// ||    3. 좌표(위도, 경도)로 가장 가까운 거리의 측정소를 찾는 함수
// =================================================================

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
