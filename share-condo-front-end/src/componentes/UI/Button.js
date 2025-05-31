// src/components/UI/Button.js
import React from 'react';

const Button = ({ onClick, children, type = 'button', className = '' }) => {
  return (
    <button type={type} onClick={onClick} className={`custom-button ${className}`}>
      {children}
    </button>
  );
};

// Add some basic styling in App.css or a dedicated UI.css
/*
.custom-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}
.custom-button:hover {
  background-color: #0056b3;
}
*/

export default Button;