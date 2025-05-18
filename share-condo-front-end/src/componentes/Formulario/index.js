import React, { useState } from "react";
import FormInput from "../FormInput";
import "./Formulario.css";

const Formulario = ({
  campos,
  onSubmit,
  titulo,
  botaoTexto,
  erro,
  sucesso,
}) => {
  const [formData, setFormData] = useState(
    campos.reduce((acc, campo) => ({ ...acc, [campo.name]: "" }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <h2>{titulo}</h2>
        {campos.map((campo) => (
          <FormInput
            label={campo.label}
            name={campo.name}
            type={campo.type}
            value={formData[campo.name]}
            onChange={handleChange}
            required={campo.required}
          />
        ))}
        {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}
        {sucesso && (
          <p style={{ color: "green", marginTop: "10px" }}>{sucesso}</p>
        )}
        <button type="submit">{botaoTexto}</button>
      </form>
      <div className="logo-container">
        <h2>Some Dividindo</h2>
        <img src="imagens/form.png" alt="Logo ShareCondo" />
      </div>
    </div>
  );
};

export default Formulario;
