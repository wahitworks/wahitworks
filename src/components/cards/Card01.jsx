import "./Card01.css";

function Card01() {
  return (
    <>
      <div className="card01-container">
        <h1>지금 대기 상태</h1>
        <div className="card01-result-cotainer">
          <div className="card01-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <Logo />
          </div>
        </div>
      </div>
    </>
  );
}

export default Card01;
