import React from 'react';
import './PageDisplay.css';

const PageDisplay = ({
  currentPage,
  lastDigit,
  isAnimating = false,
  className = '',
  ...props
}) => {
  const getDigitColor = (digit) => {
    if (digit === null) return 'digit-default';
    if (digit === 0) return 'digit-zero';
    if (digit >= 1 && digit <= 3) return 'digit-low';
    if (digit >= 4 && digit <= 6) return 'digit-medium';
    if (digit >= 7 && digit <= 9) return 'digit-high';
    return 'digit-default';
  };

  return (
    <div className={`page-display ${className}`} {...props}>
      <div className="page-header">
        <div className="page-icon">📖</div>
        <div className="page-title">Current Page</div>
      </div>
      
      <div className={`page-number ${isAnimating ? 'animating' : ''}`}>
        {currentPage || '---'}
      </div>
      
      {lastDigit !== null && (
        <div className="page-digit">
          <div className="digit-label">Last Digit</div>
          <div className={`digit-value ${getDigitColor(lastDigit)}`}>
            {lastDigit}
          </div>
        </div>
      )}
      
      {isAnimating && (
        <div className="page-animation">
          <div className="animation-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageDisplay;
