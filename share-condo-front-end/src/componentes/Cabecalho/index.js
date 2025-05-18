import React, { useEffect, useState } from "react";
import "./Cabecalho.css";
import { Link, useNavigate } from "react-router-dom";

const Cabecalho = ({ login_link, register_link }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuario");
    if (usuarioLogado) {
      setUsuario(JSON.parse(usuarioLogado));      
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
            src="imagens/logo.png"
            alt="ShareCondo Logo"
            className="share-condo-logo"
          />
          <ul className="nav-menu">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/quem-somos">Quem somos</a>
            </li>
          </ul>
        </div>
        <div className="right-group">
          {usuario ? (
            usuario.tipoUsuario === "ADMIN" ? (
              <>
                <ul className="nav-menu">
                  <li>
                    <Link to="/admin">Console Admin</Link>
                  </li>
                </ul>
                <span className="username">Olá, {usuario.nome} (ADMIN)</span>
                <button onClick={handleLogout} className="logout-btn">
                  Sair
                </button>
              </>
            ) : (
              <>
                <span className="username">Olá, {usuario.nome}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Sair
                </button>
              </>
            )
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
