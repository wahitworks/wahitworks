import './LogoModule.css';
import './LogoGood.css';

// 좋음(Good) 상태를 나타내는 로고 아이콘
// className props 받고 animated 적용 가능
// 색상: 파란색 (#409dd8)
function LogoGood({ className = '', animated = false, style }) {
  return (
    <svg
      // logo-good 클래스 + animated 클래스 + 추가 className
      className={`logo-good ${animated ? 'animated' : ''} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460.94 352.6" 
      style={style}
    >
      <defs>
        <style> {`
          .cls-good-1 {
            fill: none;
          }

          .cls-good-1, .cls-good-2 {
            stroke: #409dd8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 20px;
          }

          .cls-good-2 {
            fill: #409dd8;
          }
        `} </style>
      </defs>
      <title>deagumalguem-logo-512-good</title>
      <g id="Layer_2_good" data-name="Layer 2">
        <path className="cls-good-1" d="M206.5,341.5,126,343c-8.79.2-38.1-.24-63.69-21.5-6.56-5.45-21.87-18.54-27.81-41-7.68-29,2.83-65.14,30.5-83.5,19.48-12.92,40.22-12.25,48.5-11.5C112,136.69,149.28,95,197,91c46.33-3.89,89.12,28.86,97.5,75.5,0,0,38,1.68,55.52,29.26,9.78,15.42,9.06,31.38,8.48,37.74" transform="translate(-22.06 -80.69)"/>
      </g>
      <g id="Layer_3_good" data-name="Layer 3">
        <path className="cls-good-1" d="M275.41,221.57A21.28,21.28,0,0,0,265,210c-1-.49-9.26-4.32-18,0a21.06,21.06,0,0,0-10.57,12.75" transform="translate(-22.06 -80.69)"/>
        <path className="cls-good-1" d="M188.28,223.66c-.37-1.32-2.84-9.61-11.28-13.66-9.67-4.64-18.8.32-20,1a23.42,23.42,0,0,0-10.71,13.93" transform="translate(-22.06 -80.69)"/>
      </g>
      <g id="Layer_4_good" data-name="Layer 4">
        <path className="cls-good-1" d="M183.22,256.44s8,20,28,20,30-20,30-20" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_5_good" data-name="Layer 5">
        <path className="cls-good-1" d="M249,365c11.33,4.88,21.1,9.31,29,13,11.24,5.24,15.2,7.33,19,12,1.57,1.93,10.3,12.67,6,23a16.79,16.79,0,0,1-12,10,17.32,17.32,0,0,1-17-7" transform="translate(-23.06 -80.69)"/>
        <path className="cls-good-1" d="M228.06,320.93s24,21,66,32,65,9,65,9L359,362c1.48-.22,19.77-2.67,32,11,6.75,7.55,12.32,20.76,7,33-.65,1.5-5.6,12.41-17,15-11,2.51-23.57-3.81-30-16" transform="translate(-23.06 -80.69)"/>
        <path className="cls-good-1" d="M275,318s32,17,69,14c14.13-1.15,36.51-2.91,51.73-19.49C399.61,308.3,406.6,300.25,406,289c-.72-13.53-11.91-21.27-13-22s-13.56-8.76-27-3a26.09,26.09,0,0,0-14,14c-4.15,10.36.28,19.56,1,21" transform="translate(-23.06 -80.69)"/>
        <path className="cls-good-1" d="M413,339s12,3,17,10" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_6_good" data-name="Layer 6">
        <path className="cls-good-1" d="M389,197s-4-53,41-65C430,132,436,185,389,197Z" transform="translate(-23.06 -80.69)"/>
        <path className="cls-good-1" d="M474,186s-47,8-59,56C415,242,471,238,474,186Z" transform="translate(-23.06 -80.69)"/>
      </g>
      <g id="Layer_7_good" data-name="Layer 7">
        <circle className="cls-good-2" cx="419.44" cy="192.81" r="1.5"/>
        <circle className="cls-good-2" cx="335.44" cy="69.81" r="2.5"/>
        <circle className="cls-good-2" cx="310.44" cy="26.81" r="7.5"/>
        <circle className="cls-good-2" cx="188.44" cy="303.81" r="6.5"/>
      </g>
    </svg>
  )
};

export default LogoGood;