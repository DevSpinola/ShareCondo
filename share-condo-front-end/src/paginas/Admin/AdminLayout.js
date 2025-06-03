// src/paginas/Admin/AdminLayout.js
import React, { useEffect } from "react"; // Removido useState se não for usado aqui
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (!usuarioLogado || usuarioLogado.tipoUsuario !== "ADMIN") {
      navigate("/");
    }
  }, [usuarioLogado, navigate]);

  if (!usuarioLogado || usuarioLogado.tipoUsuario !== "ADMIN") {
    return null;
  }

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <h2>Menu Admin</h2>
        <ul>
          <li><Link to="/admin">Painel Principal</Link></li>
          <li><Link to="usuarios">Gerenciar Usuários</Link></li>
          <li><Link to="condominios">Gerenciar Condomínios</Link></li>
          <li><Link to="anuncios">Gerenciar Anúncios</Link></li>
          <li><Link to="ofertas">Gerenciar Ofertas</Link></li>
        </ul>
      </nav>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;