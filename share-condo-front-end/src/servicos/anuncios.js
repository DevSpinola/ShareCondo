// src/servicos/anuncios.js
import axios from "axios";

const anunciosAPI = axios.create({
  baseURL: "http://localhost:8080/anuncios" // Endpoint base para anúncios
});

// Interceptor para adicionar o token JWT às requisições
anunciosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Criar um novo anúncio
async function createAnuncio(dadosAnuncio) {
  const response = await anunciosAPI.post("", dadosAnuncio);
  return response.data; // Retorna o anúncio criado
}

// Listar todos os anúncios
async function getAnuncios() {
  const response = await anunciosAPI.get("");
  return response.data;
}

// Buscar um anúncio específico por ID
async function getAnuncioById(id) {
  const response = await anunciosAPI.get(`/${id}`);
  return response.data;
}

// Atualizar um anúncio existente
async function updateAnuncio(id, dadosAnuncio) {
  // O backend para AnuncioController usa PUT para atualização completa
  const response = await anunciosAPI.put(`/${id}`, dadosAnuncio);
  return response.data; // Retorna o anúncio atualizado
}

// Deletar um anúncio
async function deleteAnuncio(id) {
  await anunciosAPI.delete(`/${id}`);
  // Geralmente não há retorno de dados em um DELETE bem-sucedido
}

export {
  createAnuncio,
  getAnuncios,
  getAnuncioById,
  updateAnuncio,
  deleteAnuncio
};