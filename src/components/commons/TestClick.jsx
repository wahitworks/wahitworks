import React from 'react';
import './TestClick.css';
import { CiStar } from 'react-icons/ci';

const TestClick = () => {
    
  const handleEvent = (eventName, caseLabel, e, options) => {
    if (options.stopPropagation) {
      e.stopPropagation();
    }
    if (options.preventDefault) {
      e.preventDefault();
    }
    console.log(`Event: ${eventName}, Case: "${caseLabel}"`);
  };

  const testCases = [
    // onClick
    { label: '1. onClick', event: 'onClick', options: { stopPropagation: false, preventDefault: false } },
    { label: '2. onClick + stopPropagation', event: 'onClick', options: { stopPropagation: true, preventDefault: false } },
    { label: '3. onClick + preventDefault', event: 'onClick', options: { stopPropagation: false, preventDefault: true } },
    { label: '4. onClick + both', event: 'onClick', options: { stopPropagation: true, preventDefault: true } },
    // onTouchStart
    { label: '5. onTouchStart', event: 'onTouchStart', options: { stopPropagation: false, preventDefault: false } },
    { label: '6. onTouchStart + stopPropagation', event: 'onTouchStart', options: { stopPropagation: true, preventDefault: false } },
    { label: '7. onTouchStart + preventDefault', event: 'onTouchStart', options: { stopPropagation: false, preventDefault: true } },
    { label: '8. onTouchStart + both', event: 'onTouchStart', options: { stopPropagation: true, preventDefault: true } },
    // onTouchEnd
    { label: '9. onTouchEnd', event: 'onTouchEnd', options: { stopPropagation: false, preventDefault: false } },
    { label: '10. onTouchEnd + stopPropagation', event: 'onTouchEnd', options: { stopPropagation: true, preventDefault: false } },
    { label: '11. onTouchEnd + preventDefault', event: 'onTouchEnd', options: { stopPropagation: false, preventDefault: true } },
    { label: '12. onTouchEnd + both', event: 'onTouchEnd', options: { stopPropagation: true, preventDefault: true } },
    // onMouseDown
    { label: '13. onMouseDown', event: 'onMouseDown', options: { stopPropagation: false, preventDefault: false } },
    { label: '14. onMouseDown + stopPropagation', event: 'onMouseDown', options: { stopPropagation: true, preventDefault: false } },
    { label: '15. onMouseDown + preventDefault', event: 'onMouseDown', options: { stopPropagation: false, preventDefault: true } },
    { label: '16. onMouseDown + both', event: 'onMouseDown', options: { stopPropagation: true, preventDefault: true } },
  ];

  return (
    <div className="test-click-container">
      <h3 style={{ margin: '10px' }}>Event Handler Test</h3>
      <p style={{ margin: '10px', fontSize: '14px' }}>
        PC와 모바일에서 스크롤하며 각 케이스의 별 아이콘을 터치/클릭하고 콘솔을 확인하세요.
      </p>
      <div className="scrollable-area">
        {testCases.map((testCase) => {
          // 각 케이스에 맞는 이벤트 핸들러를 동적으로 생성
          const eventHandlerProps = {
            [testCase.event]: (e) => handleEvent(testCase.event, testCase.label, e, testCase.options)
          };

          return (
            <div className="icon-wrapper" key={testCase.label}>
              <span className="icon-label">{testCase.label}</span>
              <span className="icon-trigger" {...eventHandlerProps}>
                <CiStar size={30} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestClick;