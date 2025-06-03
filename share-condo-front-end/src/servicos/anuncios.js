// src/servicos/anuncios.js
import axios from "axios";

const anunciosAPI = axios.create({
  baseURL: "http://localhost:8080/anuncios"
});

anunciosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

async function createAnuncio(dadosAnuncio) {
  const response = await anunciosAPI.post("", dadosAnuncio);
  return response.data;
}

async function getAnuncios() {
  const response = await anunciosAPI.get("");
  return response.data;
}

// Novo: Buscar anúncios do usuário logado
async function getAnunciosDoUsuarioLogado() {
  const response = await anunciosAPI.get("/meus");
  return response.data;
}

async function getAnuncioById(id) {
  const response = await anunciosAPI.get(`/${id}`);
  return response.data;
}

async function updateAnuncio(id, dadosAnuncio) {
  const response = await anunciosAPI.put(`/${id}`, dadosAnuncio);
  return response.data;
}

async function deleteAnuncio(id) {
  await anunciosAPI.delete(`/${id}`);
}

export {
  createAnuncio,
  getAnuncios,
  getAnunciosDoUsuarioLogado, // Exportar nova função
  getAnuncioById,
  updateAnuncio,
  deleteAnuncio
};