import { useSelector } from 'react-redux';
import './EditBookmarkNickname.css';
import { useState } from 'react';

function EditBookmarkNickname() {
  // ===== 전역 state
  const nicknameEditflg = useSelector(state => state.bookmarkSlice.nicknameEditflg);

  // ===== 로컬 state
  const [nicknameInput, setNicknameInput] = useState('');




  return (
    <>
      <div className="bookmark-modal-background"></div>
      <div className="bookmark-modal-container">
        <div className="bookmark-modal-alert-header">
          <h2 className="bookmark-modal-alert-header-title">내 장소 이름 바꾸기</h2>
          <span className="bookmark-modal-alert-header-off">✕</span>
        </div>
        <hr className="bookmark-modal-alert-line" />
        <div className="bookmark-modal-alert-content">
          <p>6글자까지 저장 가능해요.</p>
          <input className="bookmark-modal-alert-input" type="text" placeholder='내 집' />
          <div className="bookmark-modal-button-container">
            <button className="bookmark-modal-button" type='button'>
              취소
            </button>
            <button className="bookmark-modal-button" type='button'>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </>
  )
};

export default EditBookmarkNickname;