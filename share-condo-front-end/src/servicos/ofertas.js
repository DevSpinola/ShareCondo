// src/servicos/ofertas.js
import axios from "axios";

const ofertasAPI = axios.create({
  baseURL: "http://localhost:8080/ofertas" // Endpoint base para ofertas
});

// Interceptor para adicionar o token JWT às requisições
ofertasAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Criar uma nova oferta para um anúncio específico
async function createOfertaParaAnuncio(anuncioId, dadosOferta) {
  const response = await ofertasAPI.post(`/anuncio/${anuncioId}`, dadosOferta);
  return response.data; // Retorna a oferta criada
}

// Listar ofertas de um anúncio específico
async function getOfertasPorAnuncio(anuncioId) {
  const response = await ofertasAPI.get(`/anuncio/${anuncioId}`);
  return response.data;
}

// Listar ofertas feitas por um usuário específico
async function getOfertasPorUsuario(usuarioId) {
  const response = await ofertasAPI.get(`/usuario/${usuarioId}`);
  return response.data;
}

// Buscar uma oferta específica por ID
async function getOfertaById(id) {
  const response = await ofertasAPI.get(`/${id}`);
  return response.data;
}

// (Opcional) Exemplo para atualizar status de uma oferta, se implementado no backend
// async function updateOfertaStatus(ofertaId, novoStatus) {
//   const response = await ofertasAPI.put(`/${ofertaId}/status`, { status: novoStatus });
//   return response.data;
// }

// (Opcional) Exemplo para deletar uma oferta
// async function deleteOferta(id) {
//   await ofertasAPI.delete(`/${id}`);
// }

export {
  createOfertaParaAnuncio,
  getOfertasPorAnuncio,
  getOfertasPorUsuario,
  getOfertaById
  // updateOfertaStatus, // Descomente se implementar
  // deleteOferta // Descomente se implementar
};