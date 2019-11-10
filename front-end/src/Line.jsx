import * as React from "react";

// TODO: Make this an actual line
function Line({ points }) {
  return (
    <g>
      <polyline
        points={points.map(pt => pt.join(',')).join(' ')}
        fill="none"
        stroke="pink"
      />
    </g>
  );
}

export default Line;
