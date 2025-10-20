import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTutorialVisible } from "../../store/slices/headerSlice";
import "./AppTutorial.css";

// 튜토리얼 단계 목록
const tutorialSteps = [
  {
    targetSelector: ".header-title",
    message: "지역을 검색해보세요. 선택된 지역의 대기상태를 불러옵니다.",
    position: "bottom",
  },
  {
    targetSelector: "#main-container > div:first-child",
    message:
      "선택된 지역을 기반으로 다양한 대기 상태에 관련된 정보들을 보여주는 카드입니다. ",
    position: "bottom",
  },
  {
    targetSelector: ".header-menu",
    message:
      "세부 기능 메뉴입니다. 장소 즐겨찾기, 카드 관리, 앱 수동 설치, 사이트 소개등이 있습니다.",
    position: "bottom",
  },
  {
    targetSelector: ".main-add-card-container",
    message:
      "홈 화면에서 카드 관리를 하고싶을 때 해당 기능으로 바로 갈 수있습니다.",
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

    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      closeTutorial();
    }
  };

  // step이 변경될 때마다 실행되는 효과
  useEffect(() => {
    const currentStep = tutorialSteps[step];
    if (!currentStep) return;

    const element = document.querySelector(currentStep.targetSelector);
    if (element) {
      // 요소를 화면 중앙으로 부드럽게 스크롤합니다.
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      // 스크롤 애니메이션이 끝날 시간을 기다린 후 위치를 측정합니다.
      const scrollTimeout = setTimeout(() => {
        setTargetPosition(element.getBoundingClientRect());
      }, 500); // 0.5초 대기

      // 컴포넌트가 언마운트되거나 step이 바뀌면 timeout을 정리합니다.
      return () => clearTimeout(scrollTimeout);
    } else {
      // 요소를 찾지 못하면 다음 단계로 자동 이동
      goToNextStep();
    }
  }, [step]);

  const currentStep = tutorialSteps[step];

  // 스타일 동적 계산
  const highlightStyle = targetPosition
    ? {
        left: `${targetPosition.left - 5}px`,
        top: `${targetPosition.top - 5}px`,
        width: `${targetPosition.width + 10}px`,
        height: `${targetPosition.height + 10}px`,
      }
    : { display: "none" };

  const messageBoxStyle = targetPosition
    ? (() => {
        const messageBoxMaxWidth = 300; // CSS의 max-width와 일치
        const viewportPadding = 10; // 화면 가장자리로부터 최소 여백

        const targetCenter = targetPosition.left + targetPosition.width / 2;
        let calculatedLeft = targetCenter - messageBoxMaxWidth / 2;

        // 화면 왼쪽 가장자리 오버플로우 방지
        if (calculatedLeft < viewportPadding) {
          calculatedLeft = viewportPadding;
        }

        // 화면 오른쪽 가장자리 오버플로우 방지
        const viewportWidth = window.innerWidth;
        if (
          calculatedLeft + messageBoxMaxWidth >
          viewportWidth - viewportPadding
        ) {
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
          transform: "none", // translateX는 더 이상 필요 없음
        };
      })()
    : { display: "none" };

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
