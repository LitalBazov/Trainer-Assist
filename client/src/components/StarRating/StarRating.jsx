import React, { useState } from 'react';
import './StarRating.css';

function StarRating({ value, onChange }) { 
  const [hoveredValue, setHoveredValue] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  const handleMouseEnter = (starValue) => {
    setHoveredValue(starValue);
  };

  const handleMouseLeave = () => {
    setHoveredValue(0);
  };

  const handleClick = (starValue) => {
    onChange(starValue);
  };

  return (
    <div className="star-rating" onMouseLeave={handleMouseLeave}>
      {stars.map((starValue) => (
        <span
          key={starValue}
          className={`star ${starValue <= (hoveredValue || value) ? 'filled' : ''}`}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
        >
          {starValue <= (hoveredValue || value) ? '★' : '☆'}
        </span>
      ))}
      {hoveredValue > 0 && (
        <div className="star-label">{hoveredValue} Stars</div>
      )}
    </div>
  );
}

export default StarRating; 



