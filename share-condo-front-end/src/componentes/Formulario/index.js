// src/componentes/Formulario/index.js
import React, { useState, useEffect } from "react"; // Adicionado useEffect para lidar com campos default
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
  // Inicializa o formData com base nos campos passados.
  // Garante que o estado seja atualizado se a prop 'campos' mudar.
  const initialFormData = campos.reduce((acc, campo) => {
    // Define um valor padrão para select para evitar que seja "undefined" inicialmente
    // se o primeiro option não tiver um value="" e não for o default.
    // Ou pode-se garantir que o value no estado corresponda a uma opção válida.
    acc[campo.name] = campo.type === 'select' ? (campo.options?.[0]?.value || '') : '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  // Atualiza o formData se os campos ou sua estrutura mudarem
  // Isso é útil se os campos são dinâmicos, como no CadastroPage
  useEffect(() => {
    const newInitialFormData = campos.reduce((acc, campo) => {
      // Mantém o valor existente se o campo ainda existir, senão usa o default
      acc[campo.name] = formData[campo.name] !== undefined 
        ? formData[campo.name]
        : (campo.type === 'select' ? (campo.options?.[0]?.value || '') : '');
      return acc;
    }, {});
    setFormData(newInitialFormData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campos]); // Dependência apenas em 'campos' para re-inicializar se os campos mudarem


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
            key={campo.name} // Adicionar key é uma boa prática
            label={campo.label}
            name={campo.name}
            type={campo.type}
            value={formData[campo.name] || ''} // Garante que value não seja undefined
            onChange={handleChange}
            required={campo.required}
            options={campo.options} // <<< Certifique-se que 'options' está sendo passado
            text={campo.text}       // <<< Certifique-se que 'text' está sendo passado (para type="info")
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
        <img src="/imagens/form.png" alt="Logo ShareCondo" />
      </div>
    </div>
  );
};

export default Formulario;