import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../cards/Card02.css";

const Card02LoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e6e9ecff" highlightColor="#f8f9fa">
      <div
        className="card02-container"
        style={{ backgroundColor: "#e6e9ecff", border: "none" }}
      >
        <h2 style={{ marginBottom: "5px" }}>
          <Skeleton height={28} />
        </h2>
        <p className="card02-measure-time" style={{ marginBottom: "10px" }}>
          <Skeleton height={12} />
        </p>
        <div className="day-navigation">
          <Skeleton circle width={35} height={35} />
          <div
            className="card02-date-flex-container"
            style={{ alignItems: "center", gap: "4px" }}
          >
            <Skeleton height={24} width={50} />
            <Skeleton height={16} width={90} />
          </div>
          <Skeleton circle width={35} height={35} />
        </div>
        <div className="forecasts-grid">
          {[...Array(3)].map((_, i) => (
            <div
              className="forecast-item"
              key={i}
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <h4>
                <Skeleton />
              </h4>
              <div className="forecast-img-wrapper">
                <Skeleton circle width={60} height={60} />
              </div>
              <p>
                <Skeleton />
              </p>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default Card02LoadingSkeleton;
