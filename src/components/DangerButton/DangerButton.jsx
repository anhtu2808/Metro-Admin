import React from "react";
import "./DangerButton.css";

const DangerButton = ({ 
  children, 
  onClick, 
  type = "button", 
  size = "medium", 
  className, 
  icon,
  iconPosition = "left",
  loading = false,
  variant = "primary",
  ...props 
}) => {
  const renderIcon = () => {
    if (loading) {
      return <span className="danger-btn-loading-icon">⟳</span>;
    }
    if (icon) {
      return <span className="danger-btn-icon">{icon}</span>;
    }
    return null;
  };

  const hasText = children && children.toString().trim().length > 0;
  const buttonClass = ` ${variant === "outline" ? "customer-danger-button-outline" : "custom-danger-button"} btn-${size}${className ? ` ${className}` : ''}${
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
        <span className={`danger-btn-text${icon ? ' danger-btn-text-with-icon' : ''}`}>
          {children}
        </span>
      )}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default DangerButton; 