import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTutorialVisible } from "../../store/slices/headerSlice";
import "./AppTutorial.css";

// 튜토리얼 단계 목록
const tutorialSteps = [
  {
    targetSelector: ".header-title",
    message: "지역을 검색해보세요. \n선택된 지역의 대기상태를 불러옵니다.",
    position: "bottom",
  },
  {
    targetSelector: "#main-container > div:first-child",
    message:
      "다양한 대기 정보들을 보여주는 카드입니다. 꾹 눌러서 경우 홈 화면에서 삭제할 수 있습니다. \n\n각 카드는 메뉴의 `카드 관리`에서 재배치 가능합니다.",
    position: "bottom",
  },
  {
    targetSelector: ".header-menu-icon",
    message:
      "메뉴를 볼 수 있습니다. \n내 장소와 카드를 관리하거나, 앱을 설치 할 수 있습니다.",
    position: "bottom",
  },
  {
    targetSelector: ".main-add-card-container",
    message:
      "홈 화면에서 카드 관리를 하고싶을 때 \n해당 기능으로 바로 갈 수 있습니다.",
    position: "top",
  },
];

const AppTutorial = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0); // 현재 튜토리얼 단계
  const [targetPosition, setTargetPosition] = useState(null); // 강조할 요소의 위치 정보

  const closeTutorial = () => {
    dispatch(setTutorialVisible(false));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 다음 단계로 이동하거나 튜토리얼을 종료하는 함수
  const goToNextStep = () => {
    // 다음 단계로 넘어가기 전에 현재 UI를 숨겨 부드러운 전환을 만듭니다.
    setTargetPosition(null);

    // 배열 끝 인덱스 계산
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      // 배열 인덱스 끝 도달 시 오버레이 종료 - 스크롤 탑
      closeTutorial();
    }
  };

  // step이 변경될 때마다 실행되는 효과
  useEffect(() => {
    // [] idx로 순회하여 가이드 순차적으로 출력
    const currentStep = tutorialSteps[step];
    if (!currentStep) return;

    // 클래스 네임으로 전역에서 요소를 특정
    // 독립적인 컴포넌트들의 요소를 찾기 용이하게 바닐라 JS를 사용
    // targetSelector = 요소의 클래스 이름
    const element = document.querySelector(currentStep.targetSelector);
    if (element) {
      // 요소를 화면 중앙으로 부드럽게 스크롤합니다.
      element.scrollIntoView({ behavior: "smooth", block: "end" });

      // 스크롤 애니메이션이 끝날 시간을 기다린 후 위치를 측정 (하이라이팅 위치 오류 방지)
      const scrollTimeout = setTimeout(() => {
        // 선택된 클래스 네임의 요소의 위치를 저장
        setTargetPosition(element.getBoundingClientRect());
      }, 800); // 0.8초 대기

      // 컴포넌트가 언마운트되거나 step이 바뀌면 timeout을 정리합니다.
      return () => clearTimeout(scrollTimeout);
    } else {
      goToNextStep();
    }
  }, [step]);

  // 튜토리얼 활성화 시 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset"; // 또는 'auto'로 복원
    };
  }, []); // 컴포넌트 마운트/언마운트 시 한 번만 실행

  const currentStep = tutorialSteps[step];

  // 스타일 동적 계산
  // 단계별로 다른 확대/축소 비율을 반환하는 헬퍼 함수
  const getScaleForStep = (step) => {
    switch (step) {
      case 0: // 지역 검색
        return { x: 1.15, y: 1.3 };
      case 1: // 첫 번째 카드
        return { x: 0.99, y: 0.99 }; // 테두리를 약간 축소
      case 2: // 햄버거 메뉴
        return { x: 1.5, y: 1.5 };
      default: // 기본값
        return { x: 1.1, y: 1.1 };
    }
  };

  // 스타일 동적 계산
  const highlightStyle = targetPosition
    ? // 강조 요소 있을 시
      (() => {
        const scale = getScaleForStep(step);
        return {
          left: `${targetPosition.left}px`,
          top: `${targetPosition.top}px`,
          width: `${targetPosition.width}px`,
          height: `${targetPosition.height}px`,
          transform: `scale(${scale.x}, ${scale.y})`,
        };
      })()
    : // 없을 시 스킵
      { display: "none" };

  const messageBoxStyle = targetPosition
    ? // 강조 요소 있을 시
      (() => {
        const messageBoxMaxWidth = 300; // CSS의 max-width와 일치
        const viewportPadding = 10; // 화면 가장자리로부터 최소 여백

        // 메시지 박스를 강조 요소 기준 중앙에 배치
        // 왼쪽 시작지점 + 총 너비 / 2 = 강조 요소 중앙
        const targetCenter = targetPosition.left + targetPosition.width / 2;
        // 메시지 박스 왼쪽 시작점 구하기
        let calculatedLeft = targetCenter - messageBoxMaxWidth / 2;

        // 메시지 박스 왼쪽 시작 지점이 음수 (화면밖) 일때 양수로 변환 후 화면 안에서 출력
        if (calculatedLeft < viewportPadding) {
          calculatedLeft = viewportPadding;
        }

        // 화면 오른쪽 가장자리 오버플로우 방지
        const viewportWidth = window.innerWidth;
        if (
          // 메시지 박스의 오른쪽 끝자리 위치값
          calculatedLeft + messageBoxMaxWidth >
          // 여백을 계산한 보이는 스크린의 총 너비
          viewportWidth - viewportPadding
        ) {
          // 햄버거 메뉴 메시지 박스 오류를 픽스하기위한 메시지 박스 좌측 시작점 재 계산
          calculatedLeft = viewportWidth - messageBoxMaxWidth - viewportPadding;
          // 뷰포트가 너무 작아 음수가 되는 경우 방지
          if (calculatedLeft < viewportPadding) {
            calculatedLeft = viewportPadding;
          }
        }

        // 수직 위치는 기존 로직 유지
        const topPosition =
          currentStep.position === "bottom"
            ? `${targetPosition.bottom + 15}px`
            : currentStep.position === "middle"
              ? `${targetPosition.top + targetPosition.height / 2}px`
              : `${targetPosition.top - 70}px`;

        return {
          left: `${calculatedLeft}px`,
          top: topPosition,
          transform: "none",
        };
      })()
    : // 강조 요소 없을시
      { display: "none" };

  return (
    <div className="tutorial-overlay" onClick={goToNextStep}>
      <button
        className="tutorial-close-btn"
        onClick={(e) => {
          e.stopPropagation();
          closeTutorial();
        }}
      >
        ✕
      </button>
      <div className="tutorial-advance-indicator">
        <span>다음</span>
        <span className="arrow-animation">{">>"}</span>
      </div>

      {targetPosition && (
        <>
          <div className="tutorial-highlight" style={highlightStyle}></div>
          <div className="tutorial-message-box" style={messageBoxStyle}>
            <p>{currentStep.message}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AppTutorial;
