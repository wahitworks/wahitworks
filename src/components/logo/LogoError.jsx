import './LogoError.css';

function LogoError({ className = '', animated = false, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460.13 352.6"
      // logo-good 클래스 + animated 클래스 + 추가 className
      className={`logo-error ${animated ? 'animated' : ''} ${className}`}
      style={style}
    >
      <defs>
        <style> {`
          .cls-error-1 {
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 20px;
          }

          .cls-error-1, .cls-error-2 {
            stroke: #999;
          }

          .cls-error-2 {
            fill: #999;
            stroke-miterlimit: 10;
          }
        `} </style>
      </defs>
      <title>deagumalguem-logo-512-error</title>
      {/* 몸통 */}
      <g id="Layer_2_error" data-name="Layer 2">
        <path class="cls-error-1" d="M362.5,234.5c.58-6.36,1.3-22.32-8.48-37.74-17.51-27.58-55.52-29.26-55.52-29.26C290.12,120.86,247.33,88.11,201,92c-47.72,4-85,45.69-83.5,94.5-8.28-.75-29-1.42-48.5,11.5-29.2,19.38-35.71,57.14-30.5,83.5,1.14,5.79,4.84,23.29,19.5,38.5,1.35,1.4,17.62,17.85,42,22,10.67,1.82,26.63,1.91,41,2,2.52,0,4.6,0,6,0" transform="translate(-26.87 -81.69)"/>
      </g>
      {/* 눈 */}
      <g id="Layer_3_error" data-name="Layer 17">
        <line class="cls-error-1" x1="222.13" y1="147.31" x2="257.13" y2="116.31"/>
        <line class="cls-error-1" x1="222.13" y1="116.31" x2="257.13" y2="146.31"/>
        <line class="cls-error-1" x1="128.13" y1="147.31" x2="163.13" y2="116.31"/>
        <line class="cls-error-1" x1="128.13" y1="116.31" x2="163.13" y2="146.31"/>
      </g>
      {/* 입 */}
      <g id="Layer_4_error" data-name="Layer 18">
        <path class="cls-error-1" d="M201.5,272.89a31.81,31.81,0,0,1,41-1" transform="translate(-26.87 -81.69)"/>
      </g>
      {/* 바람 */}
      <g id="Layer_5_error" data-name="Layer 5">
        <path class="cls-error-1" d="M252,366c11.33,4.88,21.1,9.31,29,13,11.24,5.24,15.2,7.33,19,12,1.57,1.93,10.3,12.67,6,23a16.79,16.79,0,0,1-12,10,17.32,17.32,0,0,1-17-7" transform="translate(-26.87 -81.69)"/>
        <path class="cls-error-1" d="M231.06,321.93s24,21,66,32,65,9,65,9L362,363c1.48-.22,19.77-2.67,32,11,6.75,7.55,12.32,20.76,7,33-.65,1.5-5.6,12.41-17,15-11,2.51-23.57-3.81-30-16" transform="translate(-26.87 -81.69)"/>
        <path class="cls-error-1" d="M278,319s32,17,69,14c14.13-1.15,36.51-2.91,51.73-19.49C402.61,309.3,409.6,301.25,409,290c-.72-13.53-11.91-21.27-13-22s-13.56-8.76-27-3a26.09,26.09,0,0,0-14,14c-4.15,10.36.28,19.56,1,21" transform="translate(-26.87 -81.69)"/>
        <path class="cls-error-1" d="M416,340s12,3,17,10" transform="translate(-26.87 -81.69)"/>
      </g>
      {/* 물방울 */}
      <g id="Layer_6_error" data-name="Layer 10">
        <path class="cls-error-1" d="M392,198s-4-53,41-65C433,133,439,186,392,198Z" transform="translate(-26.87 -81.69)"/>
        <path class="cls-error-1" d="M477,187s-47,8-59,56C418,243,474,239,477,187Z" transform="translate(-26.87 -81.69)"/>
      </g>
      {/* 먼지 */}
      <g id="Layer_7_error" data-name="Layer 13">
        <circle class="cls-error-2" cx="418.63" cy="192.81" r="1.5"/>
        <circle class="cls-error-2" cx="334.63" cy="69.81" r="2.5"/>
        <circle class="cls-error-2" cx="309.63" cy="26.81" r="7.5"/>
        <circle class="cls-error-2" cx="187.63" cy="303.81" r="6.5"/>
      </g>
    </svg>
  )
};

export default LogoError;