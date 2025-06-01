// src/servicos/auth.js
import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:8080/auth"
});

// Login com armazenamento automático no localStorage
async function login(email, senha) {
  const response = await authAPI.post("/login", { email, senha });
  const { token, usuario } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario)); // usuario já é o UsuarioDTO do backend

  return { token, usuario };
}

// Cadastro atualizado para incluir condominioId
async function cadastro(email, nome, senha, tipoUsuario = "USUARIO", condominioId = null) {
  const payload = { email, nome, senha, tipoUsuario };
  // Backend espera condominioId para USUARIO e SINDICO
  if ((tipoUsuario === "USUARIO" || tipoUsuario === "SINDICO") && condominioId) {
    payload.condominioId = condominioId;
  }
  // ADMIN não precisa de condominioId no payload de cadastro
  return await authAPI.post("/register", payload);
}

// Logout remove os dados do usuário
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

// Recupera o usuário logado
function getUsuarioLogado() {
  const usuario = localStorage.getItem("usuario");
  // O backend já retorna UsuarioDTO em LoginResponseDTO, então o parse é direto
  return usuario ? JSON.parse(usuario) : null;
}

export { login, cadastro, logout, getUsuarioLogado };