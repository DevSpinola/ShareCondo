import React from "react";
import "./FormInput.css"; // ajuste o caminho se necessário

const FormInput = ({ label, name, type, value, onChange, required }) => {
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
