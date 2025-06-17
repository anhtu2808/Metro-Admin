import React from "react";
import "./PrimaryButton.css";

const PrimaryButton = ({ 
  children, 
  onClick, 
  type = "button", 
  size = "medium", 
  className, 
  icon,
  iconPosition = "left",
  loading = false,
  ...props 
}) => {
  const renderIcon = () => {
    if (loading) {
      return <span className="primary-btn-loading-icon">⟳</span>;
    }
    if (icon) {
      return <span className="primary-btn-icon">{icon}</span>;
    }
    return null;
  };

  const hasText = children && children.toString().trim().length > 0;
  const buttonClass = `custom-primary-button btn-${size}${className ? ` ${className}` : ''}${
    icon && !hasText ? ' btn-icon-only' : ''
  }${loading ? ' btn-loading' : ''}`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {hasText && (
        <span className={`primary-btn-text${icon ? ' primary-btn-text-with-icon' : ''}`}>
          {children}
        </span>
      )}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default PrimaryButton;
