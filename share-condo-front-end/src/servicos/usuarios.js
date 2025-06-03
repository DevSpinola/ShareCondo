// src/servicos/usuarios.js
import axios from "axios";

const usuarioAPI = axios.create({
  baseURL: "http://localhost:8080/usuario" // Endpoint base para usuários
});

// Interceptor para adicionar o token JWT às requisições
usuarioAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Funções existentes
async function getUsuario(id) {
  const response = await usuarioAPI.get(`/${id}`);
  return response.data;
}

async function getUsuarios() {
  const response = await usuarioAPI.get("");
  return response.data;
}

async function deleteUsuario(id) {
  await usuarioAPI.delete("/" + id);
}

async function updateUsuario(id, dados) {
  const response = await usuarioAPI.patch("/" + id, dados);
  return response.data;
}

// Novas funções para SINDICO/ADMIN
async function getUsuariosPendentes() {
  const response = await usuarioAPI.get("/pendentes");
  return response.data;
}

async function aprovarUsuario(id) {
  const response = await usuarioAPI.patch(`/${id}/aprovar`);
  return response.data;
}

async function rejeitarUsuario(id) {
  const response = await usuarioAPI.patch(`/${id}/rejeitar`);
  return response.data;
}

export {
  getUsuario,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
  getUsuariosPendentes, // Exportar nova função
  aprovarUsuario,       // Exportar nova função
  rejeitarUsuario       // Exportar nova função
};