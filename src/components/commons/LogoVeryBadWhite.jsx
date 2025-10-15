import './LogoVeryBadWhite.css';
import '../logo/LogoModule.css';

// 매우 나쁨(VeryBad) 상태를 나타내는 로고 아이콘
// className props 받고 animated 적용 가능
// 색상: 빨간색 (#db1d1c)
function LogoVeryBadWhite({ className = '', animated = false, style }) {
  return (
    <svg
      // logo-very-bad 클래스 + animated 클래스 + 추가 className
      className={`logo-very-bad-white ${animated ? 'animated' : ''} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460.13 352.6"
      style={style}
    >
      <defs>
        <style>{`
          .cls-very-bad-white-1 {
            fill: none;
          }

          .cls-very-bad-white-1, .cls-very-bad-white-2 {
            stroke: #fff;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 20px;
          }

          .cls-very-bad-white-2 {
            fill: #fff;
          }
        `}</style>
      </defs>
      <title>deagumalguem-logo-512-red</title>
      <g id="Layer_2_very-bad-white" data-name="Layer 2">
        <path className="cls-very-bad-white-1" d="M362.5,234.5c.58-6.36,1.3-22.32-8.48-37.74-17.51-27.58-55.52-29.26-55.52-29.26C290.12,120.86,247.33,88.11,201,92c-47.72,4-85,45.69-83.5,94.5-8.28-.75-29-1.42-48.5,11.5-29.2,19.38-35.71,57.14-30.5,83.5,1.14,5.79,4.84,23.29,19.5,38.5,1.35,1.4,17.62,17.85,42,22,10.67,1.82,26.63,1.91,41,2,2.52,0,4.6,0,6,0" transform="translate(-26.87 -81.69)"/>
      </g>
      <g id="Layer_3_very-bad-white" data-name="Layer 3">
        <line className="cls-very-bad-white-1" x1="128.13" y1="116.31" x2="163.13" y2="146.31"/>
        <line className="cls-very-bad-white-1" x1="128.13" y1="147.31" x2="163.13" y2="116.31"/>
        <line className="cls-very-bad-white-1" x1="222.13" y1="116.31" x2="257.13" y2="146.31"/>
        <line className="cls-very-bad-white-1" x1="222.13" y1="147.31" x2="257.13" y2="116.31"/>
      </g>
      <g id="Layer_4_very-bad-white" data-name="Layer 4">
        <path className="cls-very-bad-white-1" d="M295,301a87.2,87.2,0,0,0-5-42c-58-20-147,0-147,0a174.73,174.73,0,0,0,5,87s38,7,76,4" transform="translate(-26.87 -81.69)"/>
        <line className="cls-very-bad-white-1" x1="107.13" y1="181.31" x2="11.25" y2="168.42"/>
        <line className="cls-very-bad-white-1" x1="258.54" y1="175.31" x2="334.13" y2="158.31"/>
        <path className="cls-very-bad-white-1" d="M199,286a31.81,31.81,0,0,1,41-1" transform="translate(-26.87 -81.69)"/>
      </g>
      <g id="Layer_5_very-bad-white" data-name="Layer 5">
        <path className="cls-very-bad-white-1" d="M249,365c11.33,4.88,21.1,9.31,29,13,11.24,5.24,15.2,7.33,19,12,1.57,1.93,10.3,12.67,6,23a16.79,16.79,0,0,1-12,10,17.32,17.32,0,0,1-17-7" transform="translate(-23.06 -80.69)"/>
        <path className="cls-very-bad-white-1" d="M228.06,320.93s24,21,66,32,65,9,65,9L359,362c1.48-.22,19.77-2.67,32,11,6.75,7.55,12.32,20.76,7,33-.65,1.5-5.6,12.41-17,15-11,2.51-23.57-3.81-30-16" transform="translate(-23.06 -80.69)"/>
        <path className="cls-very-bad-white-1" d="M275,318s32,17,69,14c14.13-1.15,36.51-2.91,51.73-19.49C399.61,308.3,406.6,300.25,406,289c-.72-13.53-11.91-21.27-13-22s-13.56-8.76-27-3a26.09,26.09,0,0,0-14,14c-4.15,10.36.28,19.56,1,21" transform="translate(-23.06 -80.69)"/>
        <path className="cls-very-bad-white-1" d="M413,339s12,3,17,10" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_6_very-bad-white" data-name="Layer 6">
        <path className="cls-very-bad-white-1" d="M389,197s-4-53,41-65C430,132,436,185,389,197Z" transform="translate(-23.06 -80.69)"/>
        <path className="cls-very-bad-white-1" d="M474,186s-47,8-59,56C415,242,471,238,474,186Z" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_7_very-bad-white" data-name="Layer 7">
        <circle className="cls-very-bad-white-2" cx="419.44" cy="192.81" r="1.5"/>
        <circle className="cls-very-bad-white-2" cx="335.44" cy="69.81" r="2.5"/>
        <circle className="cls-very-bad-white-2" cx="310.44" cy="26.81" r="7.5"/>
        <circle className="cls-very-bad-white-2" cx="188.44" cy="303.81" r="6.5"/>
      </g>
    </svg>
  )
};

export default LogoVeryBadWhite;