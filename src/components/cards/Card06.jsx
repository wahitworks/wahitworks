import "./Card06.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { getLatestAirCondition } from "../../store/thunks/latestAirConditionThunk";
import { IoInformationCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

function Card06() {
  // ===== Hook =====
  const dispatch = useDispatch();
  // ===== 전역 State =====
  const pm10pm25ValueList = useSelector(state => state.latestAirCondition.pm10pm25ValueList);
  const measuringStation = useSelector(state => state.locationSlice.measuringStation);
  // ===== 로컬 State =====
  const [selectGraph, setSelectGraph] = useState('PM10'); // 기본값: PM10
  const [showInfoTooltip, setShowInfoTooltip] = useState(false); // 정보 툴팁 표시 여부

  // ===== 정보 툴팁 자동 닫기 함수 =====
  const handleInfoIconClick = () => {
    setShowInfoTooltip(true);
    // 3초 후 자동으로 닫힌다
    setTimeout(() => {
      setShowInfoTooltip(false);
    }, 2500);
  };

  // ===== 탭 메뉴 =====
  const tabs = [
    { id: 'PM10', label: '미세먼지' },
    { id: 'PM25', label: '초미세먼지' },
  ];

  // ===== 선택된 탭에 따라 dataKey 결정 =====
  const dataKey = selectGraph === 'PM10' ? 'pm10' : 'pm25';
  const strokeColor = selectGraph === 'PM10' ? 'var(--personal-blue)' : 'var(--deep-blue)';

  
  useEffect(() => {
    // measuringStation이 있을 때만 API 호출
    if (measuringStation) {
      dispatch(getLatestAirCondition(measuringStation));
    }
  }, [measuringStation, dispatch])
  
  
  // ===== 그래프 관련 =====

  // 등급별 배경색 구간 (PM10 / PM25 기준 다름) 
  const gradeRanges = selectGraph === 'PM10'
    ? {
        good: { y1: 0, y2: 30, color: '#E3F2FD' },      // 좋음 (연한 파랑)
        moderate: { y1: 30, y2: 80, color: '#E8F5E9' }, // 보통 (연한 초록)
        bad: { y1: 80, y2: 150, color: '#FFF9C4' },     // 나쁨 (연한 노랑)
        veryBad: { y1: 150, y2: 180, color: '#FFEBEE' } // 매우나쁨 (연한 빨강)
      }
    : {
        good: { y1: 0, y2: 15, color: '#E3F2FD' },
        moderate: { y1: 15, y2: 35, color: '#E8F5E9' },
        bad: { y1: 35, y2: 75, color: '#FFF9C4' },
        veryBad: { y1: 75, y2: 100, color: '#FFEBEE' }
      };

  // 6시간 간격 ticks 생성 (0시, 6시, 12시, 18시)
  const filteredTicks = pm10pm25ValueList
    .filter(item => {
      const hours = new Date(item.dataTime).getHours();
      return hours % 6 === 0;
    })
    .map(item => item.dataTime);

  // 커스텀 X축 Tick (줄바꿈 지원)
  const CustomXAxisTick = ({ x, y, payload }) => {
    const date = new Date(payload.value);
    const hours = date.getHours();

    if (hours === 0) {
      // 0시: 날짜 + 시간 (2줄)
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={10} textAnchor="middle" fill="#666" fontSize={10}>
            <tspan x={0} dy={16}>0시</tspan>
            <tspan x={0} dy={14}>{`${date.getMonth() + 1}월${date.getDate()}일`}</tspan>
          </text>
        </g>
      );
    } else {
      // 그 외: 시간만 (1줄)
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={10}>
            {hours}시
          </text>
        </g>
      );
    }
  };

  return (
    <>
      <div className="card06-container">
        <div className="card06-title-container">
          <h2 className="card06-title">
            시간대별 추세
            <IoInformationCircleOutline
              className="card06-info-icon"
              onClick={handleInfoIconClick}
            />
          </h2>
          <AnimatePresence>
            {showInfoTooltip && (
              <motion.div
                className="card06-info-tooltip"
                onClick={() => setShowInfoTooltip(false)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                측정되지 않은 값은 비어있을 수 있습니다.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 탭 메뉴 */}
        <div className="card06-tab-Btn-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`card06-tab-Btn ${selectGraph === tab.id ? 'card06-tab-Btn-active' : ''}`}
              onClick={() => setSelectGraph(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 그래프 영역 */}
        <div className="card06-graph-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={pm10pm25ValueList}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              {/* 등급별 배경 구간 */}
              <ReferenceArea y1={gradeRanges.good.y1} y2={gradeRanges.good.y2} fill={gradeRanges.good.color} fillOpacity={0.5} />
              <ReferenceArea y1={gradeRanges.moderate.y1} y2={gradeRanges.moderate.y2} fill={gradeRanges.moderate.color} fillOpacity={0.5} />
              <ReferenceArea y1={gradeRanges.bad.y1} y2={gradeRanges.bad.y2} fill={gradeRanges.bad.color} fillOpacity={0.5} />
              <ReferenceArea y1={gradeRanges.veryBad.y1} y2={gradeRanges.veryBad.y2} fill={gradeRanges.veryBad.color} fillOpacity={0.5} />

              <CartesianGrid strokeDasharray="2 5" stroke="#ddd" opacity={0.3} />
              <XAxis
                dataKey="dataTime"
                interval={0}
                tick={<CustomXAxisTick />}
                height={50}
                ticks={filteredTicks}
              />
              <YAxis
                domain={[0, selectGraph === 'PM10' ? 180 : 100]}
                ticks={selectGraph === 'PM10' ? [15, 55, 115, 165] : [7.5, 25, 55, 87.5]}
                tick={(props) => {
                  const { x, y, payload } = props;
                  const value = payload.value;

                  // PM10 기준
                  let gradeName = '';
                  let gradeRange = '';
                  if (selectGraph === 'PM10') {
                    if (value === 15) { gradeName = '좋음'; gradeRange = '~30'; }
                    else if (value === 55) { gradeName = '보통'; gradeRange = '~80'; }
                    else if (value === 115) { gradeName = '나쁨'; gradeRange = '~150'; }
                    else if (value === 165) { gradeName = '매우나쁨'; gradeRange = '151~'; }
                  } else {
                    // PM25 기준
                    if (value === 7.5) { gradeName = '좋음'; gradeRange = '~15'; }
                    else if (value === 25) { gradeName = '보통'; gradeRange = '~35'; }
                    else if (value === 55) { gradeName = '나쁨'; gradeRange = '~75'; }
                    else if (value === 87.5) { gradeName = '매우나쁨'; gradeRange = '76~'; }
                  }

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={0} y={0} textAnchor="end" fill="#666" fontSize={12}>
                        <tspan x={0} dy={0}>{gradeName}</tspan>
                        <tspan x={0} dy={15}>{gradeRange}</tspan>
                      </text>
                    </g>
                  );
                }}
              />
              
              {/* Tooltip (터치/호버 시 나타남) */}
              <Tooltip
                wrapperClassName="card06-tooltip-wrapper"
                // contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', fontSize: 12 }}
                labelFormatter={(value) => {
                  return new Date(value).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    hour12: true
                  });
                }}
                formatter={(value) => {
                  return [`${value} ㎍/㎥`, ''];  // 두 번째 값을 빈 문자열로!
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>



      </div>
    </>
  )
};

export default Card06;