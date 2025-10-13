import { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Card04.css";
import { useSelector } from "react-redux";

// 각 북마크 항목 렌더링 컴포넌트
function BookmarkItem({ region }) {
  // 초기값 false(숨김 상태)
  const [listToggle, setListToggle] = useState(false);

  // 클릭시 보이기/숨김 상태
  const handleToggle = () => {
    setListToggle(!listToggle);
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
            {/* 미세먼지 */}
            <span className="air-status-pm10">●</span>
            {/* 초미세먼지 */}
            <span className="air-status-pm25">●</span>
            {/* 오존 */}
            <span className="air-status-o3">●</span>
          </div>          
        </div>
        {/* 장소 클릭시 출력 정보 */}
        {listToggle && (
          <div className={`card04-bookmark-list-toggle ${listToggle ? "show" : ""}`}>
          <div className="card04-bookmark-list-toggle-info">
            <p className="card04-bookmark-list-toggle-info-title">미세먼지</p>
          </div>
          <div className="card04-bookmark-list-toggle-info">
            <p className="card04-bookmark-list-toggle-info-title">초미세먼지</p>
          </div>
          <div className="card04-bookmark-list-toggle-info">
            <p className="card04-bookmark-list-toggle-info-title">오존O₃</p>
          </div>
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
          // 즐겨찾기 목록에서 찾아 랜드링
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
