import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Card04.css";
import { useDispatch, useSelector } from "react-redux";
// 로고
import LogoGood from '../logo/LogoGood.jsx';
import LogoModerate from '../logo/LogoModerate.jsx';
import LogoBad from '../logo/LogoBad.jsx';
import LogoVeryBad from '../logo/LogoVeryBad.jsx';
import LogoError from "../logo/LogoError.jsx";
// Thunk 
import { fetchFineDustData } from "../../store/thunks/fineDustThunk.js"; // 미세먼지 데이터

import LoadingSkeleton from "../commons/LoadingSkeleton.jsx";  // 컴포넌트 임포트
import { GRADE_CLASS } from "../../constants/ultraFineDustLevel.js";
import { useNavigate } from "react-router-dom";

// 각 북마크 항목 렌더링 컴포넌트
function BookmarkItem({ region, stationName }) {
  const dispatch = useDispatch();

  // 등급을 계산하는 함수 
  const getGradeNumberFromValue = (value, type) => {
    const standards = {
      PM10: { good: 30, moderate: 80, bad: 150 },
      PM25: { good: 15, moderate: 35, bad: 75 },
      O3: { good: 0.030, moderate: 0.090, bad: 0.150 },
    }
  
  if (value === null || value === undefined || value === '' || value === '-' || value === 0) {
    return null;
  }
  
  const standard = standards[type];
  if (!standard) {return null;}

  if (value <= standard.good) return '1';
  if (value <= standard.moderate) return '2';
  if (value <= standard.bad) return '3';
  return '4';
  }

  // 미세먼지 정보 호출
  useEffect(() => {
    if (stationName && stationName !== 'error') {
      // 다른 코드와의 통일성을 위해 객체로 넘김
      dispatch(fetchFineDustData({ stationName: stationName }));
    }
  }, [dispatch, stationName]);

  // 해당 측정소의 미세먼지 데이터 호출
  const data = useSelector((state) => stationName ? state.fineDust.data[stationName] : null);
  const loading = useSelector((state) => stationName ? state.fineDust.loading[stationName] : false);
  const error = useSelector((state) => stationName ? state.fineDust.error[stationName] : null);

  // 초기값 false(숨김 상태)
  const [listToggle, setListToggle] = useState(false);

  // 클릭시 보이기/숨김 상태
  const handleToggle = () => {
    setListToggle(!listToggle);
  }; 

  // 로딩 및 에러상태
  // stationName을 찾는 중이거나 fineDust 데이터를 가져오는 중
  const card04Loading = !stationName || loading;
  // stationName, fineDust를 찾다가 에러
  const card04Error = stationName === 'error' || error;

  // 로딩 성공
  const dustValue = data?.pm10Value;
  const ultraDustValue = data?.pm25Value;
  const o3Value = data?.o3Value;
  
  // 등급 계산
  const dustGrade = getGradeNumberFromValue(dustValue, 'PM10');
  const ultraDustGrade = getGradeNumberFromValue(ultraDustValue, 'PM25');
  const o3Grade = getGradeNumberFromValue(o3Value, 'O3');

  const pm10ClassName = GRADE_CLASS[dustGrade];  
  const pm25ClassName = GRADE_CLASS[ultraDustGrade];
  const o3ClassName = GRADE_CLASS[o3Grade];
  
  // 등급별 로고
  const AirQualityLogo = ({ grade }) => {
    switch (grade) {
      case "1": return <LogoGood animated />;
      case "2": return <LogoModerate animated />;
      case "3": return <LogoBad animated />;
      case "4": return <LogoVeryBad animated />;
      default: return <LogoError />;
    }
  }; 
  
  // 등급별 텍스트
  const getGradeText = (grade) => {
    switch (grade) {
      case "1": return "좋음";
      case "2": return "보통";
      case "3": return "나쁨";
      case "4": return "매우 나쁨";
      default: return "데이터 없음";
    }
  }

  return (
      <div className="card04-bookmark-item-container">
        {/* 클릭시 토글 */}
        <div className={`card04-bookmark-list ${listToggle ? "toggled" : ""}`} 
        onClick={handleToggle}>
          <span className="bookmark-icon">
             <FaStar color='var(--deep-blue)' />
          </span>
          <p className="card04-bookmark-list-title">{region}</p>
          <p className="card04-bookmark-list-station">{stationName} 측정소</p>
          <div className="card04-bookmark-list-air-status">
          {/* 데이터 불러오기 성공시 출력 */}
          {card04Loading && <small>로딩 중...</small>}
          {card04Error && <small>오류</small>}
          {!card04Loading && !card04Error && data && (
            <>
            {/* 미세먼지 */}
            <span className={`card04-air-status ${pm10ClassName}`}>●</span>
            {/* 초미세먼지 */}
            <span className={`card04-air-status ${pm25ClassName}`}>●</span>
            {/* 오존 */}
            <span className={`card04-air-status ${o3ClassName}`}>●</span>
            </>
          )}
          </div>
        </div>
        {/* 장소 클릭시 출력 정보 */}
        {listToggle && (
          <div className={`card04-bookmark-list-toggle ${listToggle ? "show" : ""}`}>
            {card04Error ? (
              // 에러 : 에러 메시지
              <div className="card04-bookmark-list-comment-err">정보를 가져올 수 없습니다.</div>
            ) : card04Loading ? (
              // 로딩 중 : 로딩 메시지
              <div className="card04-bookmark-list-comment-loading">
                데이터를 불러오는 중입니다...
              </div>
            ) : data ? (
              // 데이터가 불러 왔을 경우 : 상세 정보
              <>
                <div className="card04-bookmark-list-toggle-info">
                  <p className="card04-bookmark-list-toggle-info-title">미세먼지</p>
                  <p className="card04-bookmark-list-toggle-info-value">{dustValue}㎍/㎥</p>
                  <div className="card04-air-log">
                    <AirQualityLogo grade={dustGrade} />
                  </div>
                  <p className="card04-list-toggle-ingo-text">{getGradeText(dustGrade)}</p>
                </div>
                <div className="card04-bookmark-list-toggle-info">
                  <p className="card04-bookmark-list-toggle-info-title">초미세먼지</p>
                  <p className="card04-bookmark-list-toggle-info-value">{ultraDustValue}㎍/㎥</p>
                  <div className="card04-air-log">
                    <AirQualityLogo grade={ultraDustGrade} />
                  </div>
                  <p className="card04-list-toggle-ingo-text">{getGradeText(ultraDustGrade)}</p>
                </div>
                <div className="card04-bookmark-list-toggle-info">
                  <p className="card04-bookmark-list-toggle-info-title">오존O₃</p>
                  <p className="card04-bookmark-list-toggle-info-value">{o3Value}ppm</p>
                  <div className="card04-air-log">
                    <AirQualityLogo grade={o3Grade} />
                  </div>
                  <p className="card04-list-toggle-ingo-text">{getGradeText(o3Grade)}</p>
                </div>
              </>
            ) : null }
        </div>
        )}
      </div>
  )  
}

// 메인 컨포넌트
function Card04() {
  const bookmarkedRegions = useSelector(state => state.bookmarkSlice.bookmarkedRegions);
  const loading = useSelector(state => state.bookmarkSlice.loading)
  const navigate = useNavigate();

  // 카드 높이 계산
  const skeletonHeight = 60 + (bookmarkedRegions.length * 65);

  // 스켈레톤 라인 갯수
  const skeletonLines = [
    // 카드 제목
    { width: '50%', height: '50px', align: 'center' },
  ];
  // 북마크 개수만큼 라인 추가
  for (let i = 0; i < bookmarkedRegions.length; i++) {
    // 각 북마크 아이템을 표현
    skeletonLines.push({ width: '95%', height: '50px', align: 'center' });
  }

  // EditBookmark 페이지로 이동
  const Navigate = () => {
    navigate(`/editcard`);
  };
  
  // ===== 로딩 스켈레톤 =====
  if(loading) {
    return (
        <LoadingSkeleton
          width="90%" // 스켈레톤의 전체 너비 -> 고칠 필요 없음
          height={`${skeletonHeight}px`} // 높이 계산해야함
          borderRadius="15px" // 모서리 둥근 정도 -> 고칠 필요 없음
          backgroundColor="#e6e9ecff" // 기본 배경색  -> 고칠 필요 없음
          highlightColor="#F8F9FA" // 하이라이트 애니메이션 색상  -> 고칠 필요 없음
          lines={skeletonLines} // 스켈레돈 라인 생성
        />
    );
  }

  return (
    <div className="card04-container">
      <h2 className="card04-title">내 장소</h2>
      {
        bookmarkedRegions && bookmarkedRegions.length > 0 ? (
          // 즐겨찾기 목록에서 찾아 랜더링
          bookmarkedRegions.map(item => (
            <BookmarkItem 
              key={item.region} 
              region={item.region}
              stationName={item.stationName} 
            />
          ))
        ) : (
          // 즐겨찾기 목록 없을 때
          <div className="card04-bookmark-list-none">
            <p className="card04-bookmark-list-comment">즐겨찾기된 장소가 없습니다.</p>
          </div>
        )
      }
      <div className="card04-plus-btn" onClick={Navigate}>
        <p className="card04-plus-icon">+</p>
        <p className="card04-plus-comment">내 장소를 추가해 보세요!</p>
      </div>
    </div>
  );
}

export default Card04;