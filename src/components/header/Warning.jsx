import './Warning.css'
import { RiAlarmWarningFill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getWarning } from '../../store/thunks/warningThunk';

function Warning() {
  const dispatch = useDispatch();
  const { data: warningData, loading, error } = useSelector(state => state.warning);
  const [hasWarning, setHasWarning] = useState(false);
  const [daeguWarnings, setDaeguWarnings] = useState([]);
  // 팝업 표시 여부
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // 애니메이션용
  const [visible, setVisible] = useState(false);

  // API호출
  useEffect(() => {
    dispatch(getWarning());
  }, [dispatch]);

  useEffect(() => {
    if (warningData && warningData.length > 0) {
      // 대구 필터링
      const filtered = warningData.filter(
        (warning) => warning.districtName === '대구' && !warning.clearDate // 해제되지 않은 경보
      );
      setDaeguWarnings(filtered);
      setHasWarning(filtered.length > 0);
    } else {
      setDaeguWarnings([]);
      setHasWarning(false);
    }
  }, [warningData]);

  // 팝업 상태에 따라 애니메이션 상태 
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => setVisible(true, 50))
      return () => clearTimeout(timer);
    } else {
      setVisible(false); // 팝업 닫을 때 클래스 제거
    }
  }, [isPopupOpen]);

  // 경보 유무에 따라 아이콘 색상 변경
  const iconColor = hasWarning ? 'var(--red)' : '#fff';
  // 아이콘 클릭시 팝업 오픈
  const handleClick = (e)  => {
    if (hasWarning) {
      // 부모(메뉴아이콘)가 전달받는 이벤트 막기
      e.stopPropagation();
      setIsPopupOpen(true); // 팝업 열기
    }
  }

  // 팝업 닫기
  const handlePopupClose = () => {
    setIsPopupOpen(false); // 사라지는 애니메이션
    // 0.3초 후 팝업을 DOM에서 완전 제거
    setTimeout(() => {
      setIsPopupOpen(false); // 애니메이션 후 DOM 제거
    }, 300)
  }

  const handleContentClick = (e) => {
    e.stopPropagation();
  }

  if (loading) {
    return null;
  } if (error) {
    console.error("경보 데이터를 불러오는 중 오류 발생:", error);
    return null;
  }
  
  return (
    <>
    {/* 아이콘 */}
    <RiAlarmWarningFill 
      size={30} color={iconColor} style={{
        marginRight: '15px', cursor: hasWarning ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    />
    {/* 팝업 */}
    {isPopupOpen && (
      <div className={`warning-back ${visible ? 'visible' : ''}`} onClick={handlePopupClose}>
      <div className={`warning-container ${visible ? 'visible' : ''}`} onClick={handleContentClick}>
        <div className="warning-header"><RiAlarmWarningFill /></div>
        <div className="warning-item-container">
          {daeguWarnings.map((warning, index) => (
            <div className="warning-item" key={index}>
            <p className="warning-item-title">{`[${warning.itemCode === 'PM10' ? '미세먼지' : '초미세먼지'} ${warning.issueGbn}] ${warning.moveName}`}</p>
            <p className="warning-item-comment">{`발령 시각: ${warning.issueDate} ${warning.issueTime}`}</p>
          </div>
          ))            
          }
        </div>
      </div>
    </div>
    )}
    </>
  );
}

export default Warning;