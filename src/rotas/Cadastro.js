import React, { useState } from "react";
import Formulario from "../componentes/Formulario";
import Corpo from "../componentes/Corpo";
import { cadastro, login } from "../servicos/auth";

const camposCadastro = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "nome", label: "Nome", type: "text", required: true },
  { name: "senha", label: "Senha", type: "password", required: true },
  {
    name: "confirmarSenha",
    label: "Confirmar Senha",
    type: "password",
    required: true,
  },
];

const CadastroPage = () => {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleCadastro = async (dados) => {
    console.log("Cadastro com:", dados);
    if (dados.senha !== dados.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    await cadastro(dados.email, dados.nome, dados.senha, dados.tipoUsuario)
      .then(async (response) => {        
        console.log("Cadastro bem-sucedido:", response.data);
        setSucesso("Cadastro realizado com sucesso!");
        setErro("");
        if (!localStorage.getItem("token")){
          await login(dados.email, dados.senha);
          window.location.href = "/";
        }
        else if (JSON.parse(localStorage.getItem("usuario")).tipoUsuario === "ADMIN"){
          window.location.href = "/admin";          
        }     
        
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.error("Email já cadastrado");
          setErro("Email já cadastrado.");
        } else {
          console.error("Erro no cadastro:", error);
          setErro("Erro ao cadastrar. Tente novamente.");
        }
      });
  };

  return (
    <Corpo>
      <Formulario
        campos={camposCadastro}
        onSubmit={handleCadastro}
        titulo="Cadastro"
        botaoTexto="Cadastrar"
        erro={erro}
        sucesso={sucesso}
      />
    </Corpo>
  );
};

export default CadastroPage;
