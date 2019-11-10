import * as React from "react";
import { useSpring, animated } from "react-spring";

function Blob({ x, y }) {
  const pos = useSpring({ x, y });
  return (
    <g>
      <filter id="blurMe">
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <animated.circle
        cx={pos.x}
        cy={pos.y}
        r={10}
        fill="white"
        opacity={0.8}
        filter="url(#blurMe)"
      />
    </g>
  );
}

export default Blob;
