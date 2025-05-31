// src/componentes/Cabecalho/index.js
import React, { useEffect, useState } from "react";
import "./Cabecalho.css";
import { Link, useNavigate } from "react-router-dom";

const Cabecalho = ({ login_link, register_link }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem("usuario"); // Renomeado para evitar conflito de nome
    if (usuarioArmazenado) {
      setUsuario(JSON.parse(usuarioArmazenado));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
  };

  return (
    <header>
      <div className="header-content">
        <div className="left-group">
          <img
            src="/imagens/logo.png" // Corrigido para caminho relativo à pasta public
            alt="ShareCondo Logo"
            className="share-condo-logo"
          />
          <ul className="nav-menu">
            <li>
              <Link to="/">Home</Link> {/* Alterado de <a> para <Link> */}
            </li>
            <li>
              <Link to="/quem-somos">Quem somos</Link> {/* Alterado de <a> para <Link> */}
            </li>
            {/* Aba Anúncios adicionada aqui para usuários logados */}
            {usuario && (
              <li>
                <Link to="/anuncios">Anúncios</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="right-group">
          {usuario ? (
            <> {/* Fragmento para agrupar elementos do usuário logado */}
              {usuario.tipoUsuario === "ADMIN" && (
                <ul className="nav-menu" style={{ marginRight: '10px' }}> {/* Adicionado um estilo para espaçamento */}
                  <li>
                    <Link to="/admin">Console Admin</Link>
                  </li>
                </ul>
              )}
              <span className="username">Olá, {usuario.nome}{usuario.tipoUsuario === "ADMIN" ? " (ADMIN)" : ""}</span>
              <button onClick={handleLogout} className="logout-btn">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to={register_link} className="signup-btn">
                Cadastre-se
              </Link>
              <Link to={login_link} className="login-btn">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Cabecalho;