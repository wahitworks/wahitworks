import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../cards/Card02.css"; // 실제 컴포넌트의 CSS를 재사용하여 레이아웃을 일치시킵니다.

const Card02LoadingSkeleton = () => {
  return (
    <div className="card02-container">
      <h2 style={{ marginBottom: '5px' }}>
        <Skeleton width="60%" height={28} />
      </h2>
      <p className="card02-measure-time" style={{ marginBottom: '10px' }}>
        <Skeleton width="40%" height={12} />
      </p>
      <div className="day-navigation">
        <Skeleton circle width={35} height={35} />
        <div className="card02-date-flex-container" style={{ alignItems: 'center' }}>
          <Skeleton width={50} height={24} />
          <Skeleton width={90} height={16} />
        </div>
        <Skeleton circle width={35} height={35} />
      </div>
      <div className="forecasts-grid">
        {[...Array(3)].map((_, i) => (
          <div className="forecast-item" key={i}>
            <h4>
              <Skeleton width="80%" />
            </h4>
            <div className="forecast-img-wrapper">
              <Skeleton circle width={60} height={60} />
            </div>
            <p>
              <Skeleton width="50%" />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card02LoadingSkeleton;