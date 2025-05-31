// src/servicos/ofertas.js
import axios from "axios";

const ofertasAPI = axios.create({
  baseURL: "http://localhost:8080/ofertas"
});

ofertasAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

async function createOfertaParaAnuncio(anuncioId, dadosOferta) {
  const response = await ofertasAPI.post(`/anuncio/${anuncioId}`, dadosOferta);
  return response.data;
}

async function getOfertasPorAnuncio(anuncioId) {
  const response = await ofertasAPI.get(`/anuncio/${anuncioId}`);
  return response.data;
}

async function getOfertasPorUsuario(usuarioId) {
  const response = await ofertasAPI.get(`/usuario/${usuarioId}`);
  return response.data;
}

async function getOfertaById(id) {
  const response = await ofertasAPI.get(`/${id}`);
  return response.data;
}

async function getOfertas() {
  const response = await ofertasAPI.get(""); 
  return response.data;
}

async function updateOferta(id, dadosOferta) {
  const response = await ofertasAPI.patch(`/${id}`, dadosOferta); 
  return response.data;
}

async function deleteOferta(id) {
  await ofertasAPI.delete(`/${id}`);
}

// Novas funções
async function aceitarOferta(ofertaId) {
  const response = await ofertasAPI.patch(`/${ofertaId}/aceitar`);
  return response.data;
}

async function recusarOferta(ofertaId) {
  const response = await ofertasAPI.patch(`/${ofertaId}/recusar`);
  return response.data;
}

export {
  createOfertaParaAnuncio,
  getOfertasPorAnuncio,
  getOfertasPorUsuario,
  getOfertaById,
  getOfertas,
  updateOferta,
  deleteOferta,
  aceitarOferta, // Exportar
  recusarOferta  // Exportar
};