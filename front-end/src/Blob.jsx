import * as React from "react";
import { useSpring, animated } from "react-spring";

function Blob({ x, y, color = "cornflowerblue" }) {
  const pos = useSpring({ x, y });
  return (
    <g>
      <filter id="blurMe">
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <animated.circle
        cx={pos.x}
        cy={pos.y}
        r={50}
        fill={color}
        filter="url(#blurMe)"
      />
    </g>
  );
}

export default Blob;
