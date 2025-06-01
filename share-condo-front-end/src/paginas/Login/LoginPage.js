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
    setErro(""); // Limpa erros anteriores
    setSucesso(""); // Limpa sucessos anteriores
    try {
      const { usuario } = await login(dados.email, dados.senha); // auth.js já lida com localStorage
      
      // O backend agora pode impedir o login se não aprovado, ou retornar um status.
      // A função login em auth.js já armazena o usuárioDTO completo.
      // A verificação de status 'APROVADO' é feita no backend antes de gerar o token,
      // ou o token é gerado mas o frontend/backend limita ações se não aprovado.
      // Se o backend retornar erro 403 para não aprovado, o catch abaixo tratará.

      setSucesso("Login realizado com sucesso!");
      setErro("");
      
      // Redirecionar baseado no tipo de usuário e status (se necessário)
      if (usuario.tipoUsuario === "ADMIN") {
        window.location.href = "/admin";
      } else if (usuario.tipoUsuario === "SINDICO") {
        // Poderia redirecionar para um painel do síndico ou home
        window.location.href = "/sindico/aprovar-usuarios"; // Exemplo
      } else {
        window.location.href = "/"; // Home para usuários normais
      }

    } catch (error) {
      if (error.response) {
        // Tratar erros específicos do backend
        const status = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data || "Erro desconhecido";
        
        if (status === 401) {
          setErro("Email ou senha inválidos.");
        } else if (status === 403) { // Backend pode retornar 403 para contas não aprovadas
          setErro(typeof errorMessage === 'string' ? errorMessage : "Acesso negado. Sua conta pode estar pendente de aprovação ou foi rejeitada.");
        } else {
          setErro(`Erro no login: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`);
        }
      } else {
        console.error("Erro no login:", error);
        setErro("Erro ao realizar login. Verifique sua conexão ou tente novamente.");
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