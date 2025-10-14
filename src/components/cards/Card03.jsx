import "./Card03.css";
import LogoGood from '../commons/LogoGood';
import LogoModerate from '../commons/LogoModerate';
import LogoBad from '../commons/LogoBad';
import LogoVeryBad from '../commons/LogoVeryBad';
function Card03() {
  return (
    <>
      <div className="card03-container">
        <h1>지금 대기 상태</h1>
        <div className="card03-result-cotainer">
          <div className="card03-result-item">
            <p>미세먼지</p>
            <p>(PM-10)</p>
            <p>23㎍/㎥</p>
            <LogoGood animated />
            <p>좋음</p>
          </div>
          <div className="card03-result-item">
            <p>초미세먼지</p>
            <p>(PM-2.5)</p>
            <p>15㎍/㎥</p>
            <LogoModerate animated />
            <p>좋음</p>
          </div>
          <div className="card03-result-item">
            <p>오존</p>
            <p>(O₃)</p>
            <p>0.0671ppm</p>
            <LogoBad animated />
            <p>보통</p>
          </div>
          {/* <div className="card03-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <LogoVeryBad animated />
            <p>보통</p>
          </div>
          <div className="card03-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <LogoVeryBad animated />
            <p>보통</p>
          </div>
          <div className="card03-result-item">
            <p>미세먼지</p>
            <p>1023㎍/㎥</p>
            <LogoVeryBad animated />
            <p>보통</p>
          </div> */}
        </div>
      </div>
    </>
  );
}
export default Card03;