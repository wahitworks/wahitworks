import './LogoModule.css';
import './LogoBad.css';

// 나쁨(Bad) 상태를 나타내는 로고 아이콘
// className props 받고 animated 적용 가능
// 색상: 노란색 (#ecd049)
function LogoBad({ className = '', animated = false, style }) {
  return (
    <svg
      // logo-bad 클래스 + animated 클래스 + 추가 className
      className={`logo-bad ${animated ? 'animated' : ''} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460.94 352.6"
      style={style}
    >
      <defs>
        <style>{`
          .cls-bad-1 {
            fill: none;
          }

          .cls-bad-1, .cls-bad-2 {
            stroke: #ecd049;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 20px;
          }

          .cls-bad-2 {
            fill: #ecd049;
          }
        `}</style>
      </defs>
      <title>deagumalguem-logo-512-bad</title>
      <g id="Layer_2_bad" data-name="Layer 2">
        <path className="cls-bad-1" d="M207.5,341.5,127,343c-8.79.2-38.1-.24-63.69-21.5-6.56-5.45-21.87-18.54-27.81-41-7.68-29,2.83-65.14,30.5-83.5,19.48-12.92,40.22-12.25,48.5-11.5C113,136.69,150.28,95,198,91c46.33-3.89,89.12,28.86,97.5,75.5,0,0,38,1.68,55.52,29.26,9.78,15.42,9.06,31.38,8.48,37.74" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_3_bad" data-name="Layer 3">
        <path className="cls-bad-1" d="M150,206s3,15,19,16,20-16,20-16" transform="translate(-23.06 -80.69)"/>
        <path className="cls-bad-1" d="M233.22,204.42s6,17,22,16,20-16,20-16" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_4_bad" data-name="Layer 4">
        <path className="cls-bad-1" d="M183.22,256.44s8,20,28,20,30-20,30-20" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_5_bad" data-name="Layer 5">
        <path className="cls-bad-1" d="M249,365c11.33,4.88,21.1,9.31,29,13,11.24,5.24,15.2,7.33,19,12,1.57,1.93,10.3,12.67,6,23a16.79,16.79,0,0,1-12,10,17.32,17.32,0,0,1-17-7" transform="translate(-23.06 -80.69)"/>
        <path className="cls-bad-1" d="M228.06,320.93s24,21,66,32,65,9,65,9L359,362c1.48-.22,19.77-2.67,32,11,6.75,7.55,12.32,20.76,7,33-.65,1.5-5.6,12.41-17,15-11,2.51-23.57-3.81-30-16" transform="translate(-23.06 -80.69)"/>
        <path className="cls-bad-1" d="M275,318s32,17,69,14c14.13-1.15,36.51-2.91,51.73-19.49C399.61,308.3,406.6,300.25,406,289c-.72-13.53-11.91-21.27-13-22s-13.56-8.76-27-3a26.09,26.09,0,0,0-14,14c-4.15,10.36.28,19.56,1,21" transform="translate(-23.06 -80.69)"/>
        <path className="cls-bad-1" d="M413,339s12,3,17,10" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_6_bad" data-name="Layer 6">
        <path className="cls-bad-1" d="M389,197s-4-53,41-65C430,132,436,185,389,197Z" transform="translate(-23.06 -80.69)"/>
        <path className="cls-bad-1" d="M474,186s-47,8-59,56C415,242,471,238,474,186Z" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_7_bad" data-name="Layer 7">
        <circle className="cls-bad-2" cx="419.44" cy="192.81" r="1.5"/>
        <circle className="cls-bad-2" cx="335.44" cy="69.81" r="2.5"/>
        <circle className="cls-bad-2" cx="310.44" cy="26.81" r="7.5"/>
        <circle className="cls-bad-2" cx="188.44" cy="303.81" r="6.5"/>
      </g>
    </svg>
  );
}

export default LogoBad;
