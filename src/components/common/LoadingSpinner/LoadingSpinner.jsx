import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
    xl: 'spinner-xl'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    warning: 'spinner-warning',
    error: 'spinner-error',
    white: 'spinner-white',
    gray: 'spinner-gray'
  };

  const classes = [
    'spinner',
    sizeClasses[size],
    colorClasses[color],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="spinner-container" {...props}>
      <div className={classes}></div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
