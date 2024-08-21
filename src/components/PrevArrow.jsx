import React from "react";

const PrevArrow = ({ className, style, onClick }) => {
  return (
    <button
      className={className}
      style={{
        ...style,
        display: "block",
        background: "gray",
      }}
      onClick={onClick}
    >
      Prev
    </button>
  );
};

export { PrevArrow };
