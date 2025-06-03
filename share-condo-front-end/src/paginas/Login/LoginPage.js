// src/paginas/Login/LoginPage.js
import React, { useState } from "react";
import Formulario from "../../componentes/Formulario";
import Corpo from "../../componentes/Corpo";
import { login } from "../../servicos/auth";

const camposLogin = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "senha", label: "Senha", type: "password", required: true },
];

const LoginPage = () => {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleLogin = async (dados) => {
    setErro(""); 
    setSucesso(""); 
    try {
      const { usuario } = await login(dados.email, dados.senha);
      
      setSucesso("Login realizado com sucesso!");
      setErro("");
      
      if (usuario.tipoUsuario === "ADMIN") {
        window.location.href = "/admin";
      } else if (usuario.tipoUsuario === "SINDICO") {
        window.location.href = "/sindico/aprovar-usuarios";
      } else {
        window.location.href = "/";
      }

    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        let displayMessage = "Ocorreu um erro desconhecido ao tentar fazer login.";

        if (status === 401) {
          displayMessage = "Email ou senha inválidos.";
        } else if (status === 403) {
          if (typeof responseData === 'string' && responseData.trim() !== '') {
            displayMessage = responseData; // Mensagem direta do backend
          } else if (responseData && typeof responseData.message === 'string' && responseData.message.trim() !== '') {
            displayMessage = responseData.message;
          } else {
            displayMessage = "Acesso negado. Sua conta pode estar pendente de aprovação ou ter sido rejeitada.";
          }
        } else if (responseData) {
            if (responseData && typeof responseData.message === 'string' && responseData.message.trim() !== '') {
                displayMessage = `Erro no login: ${responseData.message}`;
            } else if (typeof responseData === 'string' && responseData.trim() !== '') {
                displayMessage = `Erro no login: ${responseData}`;
            } else if (typeof responseData === 'object' && responseData !== null) {
                displayMessage = `Erro no login: ${JSON.stringify(responseData)}`;
            } else {
                displayMessage = `Erro no login: Status ${status}.`;
            }
        } else if (error.message) {
            displayMessage = `Erro no login: ${error.message}`;
        }
        setErro(displayMessage);
      } else {
        console.error("Erro bruto no login:", error);
        setErro("Erro ao realizar login. Verifique sua conexão ou tente novamente mais tarde.");
      }
    }
  };

  return (
    <Corpo>
      <Formulario
        campos={camposLogin}
        onSubmit={handleLogin}
        titulo="Login"
        botaoTexto="Entrar"
        erro={erro}
        sucesso={sucesso}
      />
    </Corpo>
  );
};

export default LoginPage;