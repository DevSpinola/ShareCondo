// src/componentes/Cabecalho/index.js
import React, { useEffect, useState } from "react";
import "./Cabecalho.css";
import { Link, useNavigate } from "react-router-dom";

const Cabecalho = ({ login_link, register_link }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem("usuario");
    if (usuarioArmazenado) {
      try {
        setUsuario(JSON.parse(usuarioArmazenado));
      } catch (e) {
        console.error("Erro ao parsear usuário do localStorage", e);
        localStorage.removeItem("usuario"); // Limpa item inválido
        localStorage.removeItem("token");
      }
    }

    // Listener para storage para atualizar o cabeçalho se o login/logout ocorrer em outra aba
    const handleStorageChange = () => {
        const newUsuarioArmazenado = localStorage.getItem("usuario");
        if (newUsuarioArmazenado) {
            try {
                setUsuario(JSON.parse(newUsuarioArmazenado));
            } catch (e) {
                setUsuario(null);
            }
        } else {
            setUsuario(null);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
    // Forçar um evento para que outros componentes (como AnunciosPage) possam re-sincronizar
    // window.dispatchEvent(new Event("storage")); // Opcional, se a navegação não for suficiente
  };

  return (
    <header>
      <div className="header-content">
        <div className="left-group">
          <img
            src="/imagens/logo.png"
            alt="ShareCondo Logo"
            className="share-condo-logo"
          />
          <ul className="nav-menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/quem-somos">Quem somos</Link>
            </li>
            {usuario && ( // Mostra Anúncios se logado
              <li>
                <Link to="/anuncios">Anúncios</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="right-group">
          {usuario ? (
            <>
              {/* Links para Meus Anúncios e Minhas Ofertas */}
              <ul className="nav-menu" style={{ marginRight: '10px' }}>
                <li><Link to="/meus-anuncios">Meus Anúncios</Link></li>
                <li><Link to="/minhas-ofertas">Minhas Ofertas</Link></li>
              </ul>

              {usuario.tipoUsuario === "ADMIN" && (
                <ul className="nav-menu" style={{ marginRight: '10px' }}>
                  <li>
                    <Link to="/admin">Console Admin</Link>
                  </li>
                </ul>
              )}
              <span className="username">Olá, {usuario.nome}{usuario.tipoUsuario === "ADMIN" ? " (Admin)" : ""}</span>
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