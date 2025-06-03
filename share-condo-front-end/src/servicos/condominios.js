// src/servicos/condominios.js
import axios from "axios";

const condominiosAPI = axios.create({
  baseURL: "http://localhost:8080/condominio" // Endpoint base para condomínios
});

// Interceptor para adicionar o token JWT às requisições
condominiosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Criar um novo condomínio
async function createCondominio(dadosCondominio) {
  const response = await condominiosAPI.post("", dadosCondominio);
  return response.data; // Retorna o condomínio criado
}

// Listar todos os condomínios
async function getCondominios() {
  const response = await condominiosAPI.get("");
  return response.data;
}

// Buscar um condomínio específico por ID
async function getCondominioById(id) {
  const response = await condominiosAPI.get(`/${id}`);
  return response.data;
}

// Atualizar um condomínio existente
async function updateCondominio(id, dadosCondominio) {
  // O backend para CondominioController usa PUT
  const response = await condominiosAPI.put(`/${id}`, dadosCondominio);
  return response.data; // Retorna o condomínio atualizado
}

// Deletar um condomínio
async function deleteCondominio(id) {
  await condominiosAPI.delete(`/${id}`);
}

export {
  createCondominio,
  getCondominios,
  getCondominioById,
  updateCondominio,
  deleteCondominio
};