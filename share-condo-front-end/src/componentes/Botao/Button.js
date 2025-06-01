// src/componentes/Botao/Button.js
import React from 'react';
import './Button.css'; // <-- ADICIONE ESTA LINHA

const Button = ({ onClick, children, type = 'button', className = '', style }) => { // Adicionada prop 'style'
  return (
    <button type={type} onClick={onClick} className={`custom-button ${className}`} style={style}>
      {children}
    </button>
  );
};

export default Button;