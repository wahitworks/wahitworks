import { useState } from "react";
import "./Card04.css";

function Card04() {
  // 초기값 false(숨김 상태)
  const [listToggle, setListToggle] = useState(false);

  // 클릭시 보이기/숨김 상태
  const handleToggle = () => {
    setListToggle(!listToggle);
  };

  return (
    <>
      <div className="card04-container">
        <h2 className="card04-title">내 장소</h2>
        {/* 내 장소 출력 */}
        <div className="card04-bookmark-list" onClick={handleToggle}>
          <p>★</p>
          <p>장소 이름</p>
          <p>대기 상태</p>
        </div>
        {/* 장소 클릭시 출력 정보 */}
        {listToggle && (
          <div className="card04-bookmark-list-toggle">
          <div className="card04-bookmark-list-toggle-info">
            <p>미세먼지</p>
          </div>
          <div className="card04-bookmark-list-toggle-info">
            <p>미세먼지</p>
          </div>
          <div className="card04-bookmark-list-toggle-info">
            <p>미세먼지</p>
          </div>
        </div>
        )}
      </div>
    </>
  );
}

export default Card04;
