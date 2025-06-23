import React from "react";
import "./Preloader.css";

const Preloader = ({ fullscreen = false }) => {
  return (
    <div className={fullscreen ? "preloader fullscreen" : "preloader"}>
      <div className="spinner" />
    </div>
  );
};

export default Preloader;
