import React from "react";
import './Corpo.css'

const Corpo = ({ children }) => {
  return (
    <div className="corpo">
      {children}
    </div>
  );
};

export default Corpo;
