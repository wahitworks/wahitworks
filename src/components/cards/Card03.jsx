import "./Card03.css";
import LogoGood from '../commons/LogoGood';
import LogoModerate from '../commons/LogoModerate';
import LogoBad from '../commons/LogoBad';
import LogoVeryBad from '../commons/LogoVeryBad';

function Card03() {
  return (
    <>
      <div className="card01-container">
        <h1>지금 대기 상태</h1>
        <div className="card01-result-cotainer">
          <div className="card01-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <LogoGood animated />
          </div>
          <div className="card01-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <LogoModerate animated />
          </div>
          <div className="card01-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <LogoBad animated />
          </div>
          <div className="card01-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <LogoVeryBad animated />
          </div>
        </div>
      </div>
    </>
  );
}

export default Card03;
