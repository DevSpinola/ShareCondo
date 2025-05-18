import axios from "axios";

const usuarioAPI = axios.create({
  baseURL: "http://localhost:8080/usuario"
});

usuarioAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

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


export { getUsuario, getUsuarios, deleteUsuario, updateUsuario};