import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Card04.css";
import { useDispatch, useSelector } from "react-redux";
// 로고
import LogoGood from '../logo/LogoGood.jsx';
import LogoModerate from '../logo/LogoModerate.jsx';
import LogoBad from '../logo/LogoBad.jsx';
import LogoVeryBad from '../logo/LogoVeryBad.jsx';
// Thunk 
import { getSearchLocation } from "../../store/thunks/locationThunk.js"; // 측정소 검색 Thunk
import { fetchFineDustData } from "../../store/thunks/fineDustThunk.js"; // 미세먼지 데이터

import { GRADE_CLASS } from "../../constants/ultraFineDustLevel";

// 각 북마크 항목 렌더링 컴포넌트
function BookmarkItem({ region }) {
  const dispatch = useDispatch();

  // 지역이름으로 측정소이름 찾기 위한 Thunk호출
  useEffect(() => {
    if (region) {
      dispatch(getSearchLocation(region));
    }
  }, [dispatch, region]);

  const stationName = useSelector((state) => state.locationSlice.regionStationMap[region]);

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
  const dustGrade = data?.pm10Grade; // 미세먼지 단계
  const dustValue = data?.pm10Value; // 미세먼지 수치
  const ultraDustGrade = data?.pm25Grade; // 초미세먼지 단계
  const ultraDustValue = data?.pm25Value; // 초미세먼지 수치
  const o3Grade = data?.o3Grade; // 오존 단계
  const o3Value = data?.o3Value; // 오존 수치

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
      default: return null;
    }
  }; 

  return (
      <div className="card04-bookmark-item-container">
        {/* 클릭시 토글 */}
        <div className={`card04-bookmark-list ${listToggle ? "toggled" : ""}`} 
        onClick={handleToggle}>
          <span className="bookmark-icon">
             <FaStar color='var(--deep-blue)' />
          </span>
          <p className="card04-bookmark-list-title">{region}</p>
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
                </div>
                <div className="card04-bookmark-list-toggle-info">
                  <p className="card04-bookmark-list-toggle-info-title">초미세먼지</p>
                  <p className="card04-bookmark-list-toggle-info-value">{ultraDustValue}㎍/㎥</p>
                  <div className="card04-air-log">
                    <AirQualityLogo grade={ultraDustGrade} />
                  </div>
                </div>
                <div className="card04-bookmark-list-toggle-info">
                  <p className="card04-bookmark-list-toggle-info-title">오존O₃</p>
                  <p className="card04-bookmark-list-toggle-info-value">{o3Value}ppm</p>
                  <div className="card04-air-log">
                    <AirQualityLogo grade={o3Grade} />
                  </div>
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

  return (
    <div className="card04-container">
      <h2 className="card04-title">내 장소</h2>
      {
        bookmarkedRegions && bookmarkedRegions.length > 0 ? (
          // 즐겨찾기 목록에서 찾아 랜더링
          bookmarkedRegions.map(region => (
            <BookmarkItem key={region} region={region} />
          ))
        ) : (
          // 즐겨찾기 목록 없을 때
          <div className="card04-bookmark-list-none">
            <p className="card04-bookmark-list-comment">즐겨찾기된 장소가 없습니다.</p>
          </div>
        )
      }
    </div>
  );
}

export default Card04;
