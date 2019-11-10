import * as React from "react";

function Container({ width, height, children }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export default Container;
