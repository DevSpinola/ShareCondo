import React from "react";
import "./Secao.css";

const Secao = ({ title, subtitle, imageSrc, imageAlt, reverse = false, className = "" }) => {
  return (
<section className={`section ${className}`}>
  <div className={`section-content ${reverse ? "reverse" : ""}`}>
    <div className="text-content">
      <h1>{title}</h1>
      {subtitle && <h4>{subtitle}</h4>}
    </div>
    <div className="image-wrapper">
      <img src={imageSrc} alt={imageAlt} className="section-image" />
    </div>
  </div>
</section>
  );
};

export default Secao;
