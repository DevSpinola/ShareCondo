// src/componentes/FormInput/index.js
import React from "react";
import "./FormInput.css";

const FormInput = ({ label, name, type, value, onChange, required, options, text }) => { // Adicionadas props 'options' e 'text'
  if (type === "select") {
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {(options || []).map((option) => (
            <option key={option.value} value={option.value} disabled={option.value === "" && required}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "info") { // Para exibir texto informativo, como erros de carregamento de condomínios
    return (
      <div className="form-group">
        {label && <label>{label}</label>}
        <p className="info-text">{text}</p>
      </div>
    );
  }

  // Fallback para input normal
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default FormInput;