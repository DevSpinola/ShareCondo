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
    console.log("Login com:", dados);
    await login(dados.email, dados.senha)
      .then(() => {
        console.log("Login bem-sucedido");
        setSucesso("Login realizado com sucesso!");
        setErro("");
        window.location.href = "/";
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Email ou senha inválidos");
          setErro("Email ou senha inválidos.");
        } else {
          console.error("Erro no login:", error);
          setErro("Erro ao realizar login. Tente novamente.");
        }
      });
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
