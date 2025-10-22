const swRegister = () => {
  // navigator 배열안에 serviceWorker가 있는지 확인
  // serviceworker란? 브라우저에서 백그라운드에서 실행되는 스크립트
  // service worker는 네트워크 요청을 가로채고, ( fetch 이벤트 ),
  // (offline-first) 전략을 구현하며 ( 오프라인 상태에서도 앱이 작동하도록 ),
  // 캐시를 관리하며, ( 자주 사용하는 리소스 관리를 하여 리로딩 속도 향상 ),
  // 푸시 알림을 처리하는 등의 작업을 수행할 수 있다.
  navigator.serviceWorker
    .register("/sw.js", {
      scope: "/", // 서비스워커의 적용 범위 지정 (여기서는 루트 경로)
    })
    //  서비스 워커 등록 성공 시
    .then((registration) => {
      console.log("서비스 워커 등록 성공 with scope:", registration.scope);
    })
    //   서비스 워커 등록 실패 시
    .catch((error) => {
      console.error("서비스 워커 등록 실패", error);
    });
};

export default swRegister;
