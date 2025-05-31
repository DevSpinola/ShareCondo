// src/componentes/Admin/AdminLayout.js
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css'; // Criaremos este CSS

const AdminLayout = () => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  // Redireciona se não for admin ou não estiver logado
  useEffect(() => {
    if (!usuarioLogado || usuarioLogado.tipoUsuario !== "ADMIN") {
      navigate("/"); // Ou para uma página de "acesso negado"
    }
  }, [usuarioLogado, navigate]);

  if (!usuarioLogado || usuarioLogado.tipoUsuario !== "ADMIN") {
    return null; // Ou um loader/mensagem enquanto redireciona
  }

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <h2>Menu Admin</h2>
        <ul>
          <li><Link to="/admin">Painel Principal</Link></li>
          <li><Link to="usuarios">Gerenciar Usuários</Link></li>
          <li><Link to="condominios">Gerenciar Condomínios</Link></li>
          {/* Adicionar mais links para outras funcionalidades de admin */}
        </ul>
      </nav>
      <main className="admin-main-content">
        <Outlet /> {/* Componentes de sub-rota serão renderizados aqui */}
      </main>
    </div>
  );
};

export default AdminLayout;