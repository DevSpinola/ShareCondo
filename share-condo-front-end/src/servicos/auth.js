import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:8080/auth"
});

// Login com armazenamento automático no localStorage
async function login(email, senha) {
  const response = await authAPI.post("/login", { email, senha });
  const { token, usuario } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));

  return { token, usuario };
}

// Cadastro mantém o mesmo comportamento
async function cadastro(email, nome, senha, tipoUsuario = "USUARIO") {
  return await authAPI.post("/register", {
    email,
    nome,
    senha,
    tipoUsuario
  });
}

// Logout remove os dados do usuário
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

// Recupera o usuário logado
function getUsuarioLogado() {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
}

export { login, cadastro, logout, getUsuarioLogado };
