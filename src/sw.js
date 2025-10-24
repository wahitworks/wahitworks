import { precacheAndRoute } from "workbox-precaching";

// Vite가 빌드 시점에 생성한 자산 목록을 사용하여 서비스 워커에 캐싱 및 라우팅 설정
precacheAndRoute(self.__WB_MANIFEST);

// 서비스 워커 설치 이벤트 리스너 *self는 서비스 워커 자체를 가리킴(window와 유사)
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed", event);
});

// 서비스 워커 활성화 이벤트 리스너
self.addEventListener("activate", (event) => {
  console.log("Service Worker: activated", event);
});

// 서비스 워커가 네트워크 요청을 가로챌 때마다 호출되는 이벤트 리스너
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: resource fetched", event);
});
