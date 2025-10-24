import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // 서비스 워커 자동 업데이트
      strategies: "injectManifest", // 커스텀 서비스워커 사용 설정
      srcDir: "src", // 커스텀 서비스 워커 파일 경로
      filename: "sw.js", // 커스텀 서비스 워커 파일 이름
      devOptions: {
        enabled: true, // dev 서버에서 PWA 활성화
        type: "module", // SW를 모듈로 로드
      },
      includeAssets: [
        // 로컬 경로의 이미지 참조 (PWA에 포함 시킬 정적 파일, 인터넷이 안되도 뜸)
        "icons/logo_180.svg",
        "icons/logo_192.svg",
        "icons/logo_512.svg",
      ],
      manifest: {
        name: "대구맑음", // 앱 이름 (설치 배너에 표시)
        short_name: "대구맑음", // 앱 짧은 이름 (홈 화면에 표시)
        description: "대구 지역 미세먼지 정보 제공 사이트", // 앱 설명
        theme_color: "#ffffff", // 브라우저 UI 테마 색상
        background_color: "#ffffff", // 앱 시작 시 배경 색상
        lang: "ko", // 앱 기본 언어
        display: "standalone", // 앱 표시 모드 (전체 화면, 최소 UI 등)
        orientation: "portrait", // 앱 화면 방향 (세로 모드)
        start_url: "/", // 앱 시작 URL (홈 화면에서 열 때)
        icons: [
          {
            src: "/icons/logo_192.svg", // 아이콘 경로
            sizes: "192x192", // 아이콘 크기
            type: "image/svg+xml", // 아이콘 타입
            purpose: "any", // 아이콘 용도 (any: 일반, maskable: 마스크 가능)
            // 아이콘 용도 Windows(edge, chrome on desktop 등)의 경우, 'any' 중 가장 첫번째 아이콘을 사용
            // Android Chrome의 경우, maskable을 우선 사용
            // IOS Safari의 경우, 'any' 중 가장 마지막 아이콘을 사용, manifest를 지원하지않고 index.html의 apple-touch-icon만 사용
          },
          {
            src: "/icons/logo_512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});