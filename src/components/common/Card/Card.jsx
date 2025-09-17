import React from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: 'card-default',
    elevated: 'card-elevated',
    outlined: 'card-outlined',
    filled: 'card-filled',
    gradient: 'card-gradient'
  };
  const paddingClasses = {
    none: 'card-padding-none',
    sm: 'card-padding-sm',
    md: 'card-padding-md',
    lg: 'card-padding-lg',
    xl: 'card-padding-xl'
  };
  const shadowClasses = {
    none: 'card-shadow-none',
    sm: 'card-shadow-sm',
    md: 'card-shadow-md',
    lg: 'card-shadow-lg',
    xl: 'card-shadow-xl'
  };
  const roundedClasses = {
    none: 'card-rounded-none',
    sm: 'card-rounded-sm',
    md: 'card-rounded-md',
    lg: 'card-rounded-lg',
    xl: 'card-rounded-xl',
    '2xl': 'card-rounded-2xl',
    '3xl': 'card-rounded-3xl'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Sub-components
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`card-title ${className}`} {...props}>
    {children}
  </h3>
);

const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={`card-subtitle ${className}`} {...props}>
    {children}
  </p>
);

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;

export default Card;
