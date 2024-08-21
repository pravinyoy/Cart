import React from "react";

const NextArrow = ({ className, style, onClick }) => {
  return (
    <button
      className={className}
      style={{
        ...style,
        display: "block",
        background: "gray"
      }}
      onClick={onClick}
    >
      Next
    </button>
  );
};

export { NextArrow };
