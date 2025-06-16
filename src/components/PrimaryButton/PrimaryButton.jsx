import React from "react";
import "./PrimaryButton.css";

const PrimaryButton = ({ children, onClick, type = "button", size = "medium", className, ...props }) => {
  return (
    <button
      className={`custom-primary-button btn-${size}` + (className ? ` ${className}` : "")}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
