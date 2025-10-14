import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Card04.css";
import { useDispatch, useSelector } from "react-redux";
// 로고
import LogoGood from '../commons/LogoGood';
import LogoModerate from '../commons/LogoModerate';
import LogoBad from '../commons/LogoBad';
import LogoVeryBad from '../commons/LogoVeryBad';

import { fetchFineDustData } from "../../store/thunks/fineDustThunk";
import { GRADE_CLASS } from "../../constants/ultraFineDustLevel";

// 각 북마크 항목 렌더링 컴포넌트
function BookmarkItem({ region }) {
  const dispatch = useDispatch();

  // region사용 해당 지역 상태 불러오기
  const data = useSelector((state) => state.fineDust.data[region]);
  const loading = useSelector((state) => state.fineDust.loading[region]);
  const error = useSelector((state) => state.fineDust.error[region]);

  // 지역에 해당하는 미세먼지 데이터 불러오기
  useEffect(() => {
    dispatch(fetchFineDustData({ stationName: region }))
  }, [dispatch, region]);

  // 초기값 false(숨김 상태)
  const [listToggle, setListToggle] = useState(false);

  // 클릭시 보이기/숨김 상태
  const handleToggle = () => {
    setListToggle(!listToggle);
  }; 

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
          {loading && <small>로딩 중...</small>}
          {error && <small>오류</small>}
          {!loading && !error && data && (
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
            {error ? (
              // 에러 : 에러 메시지
              <div className="card04-bookmark-list-comment-err">오류: {error}</div>
            ) : loading ? (
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
