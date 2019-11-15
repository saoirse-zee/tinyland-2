import * as React from "react";

/**
 * 
 * @param {value} expects value between 0 and 100
 */
function Dial({ x, y, value }) {
  const angleInDegrees = 180 + value / 100 * 360;
  const radius = 20;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g transform={`rotate(${angleInDegrees})`}>
        <circle
          cx={0}
          cy={0}
          r={radius}
          stroke="white"
          opacity={0.8}
        />
        <line
          x1={0}
          y1={radius}
          x2={0}
          y2={radius * 1.5}
          stroke="white"
          strokeWidth={3}
        />
      </g>
      <text transform={`translate(${- radius / 2}, 5)`} fill="white">{value}</text>
    </g>
  );
}

export default Dial;
