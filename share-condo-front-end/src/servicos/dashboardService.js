// src/servicos/dashboardService.js
import axios from "axios";

const dashboardAPI = axios.create({
  baseURL: "http://localhost:8080/dashboard" // Endpoint base para dashboard
});

// Interceptor para adicionar o token JWT às requisições
dashboardAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

async function getDashboardStats() {
  const response = await dashboardAPI.get("/stats");
  return response.data;
}

export {
  getDashboardStats
};