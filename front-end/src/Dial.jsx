import * as React from "react";
import { useSpring, animated } from "react-spring";

/**
 * 
 * @param {angle} expects angle in radians
 */
function Dial({ x, y, angle }) {
  const pos = useSpring({ x, y });
  const angleInDegrees = 180 + angle * (180 / Math.PI);
  const dialValue = Math.round(angle / (2 * Math.PI)  * 100)
  const radius = 20;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g transform={`rotate(${angleInDegrees})`}>
        <animated.circle
          cx={0}
          cy={0}
          r={radius}
          stroke="white"
          opacity={0.8}
        />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={40}
          stroke="white"
        />
      </g>
      <text transform={`translate(${- radius / 2}, 5)`} fill="white">{dialValue}</text>
    </g>
  );
}

export default Dial;
