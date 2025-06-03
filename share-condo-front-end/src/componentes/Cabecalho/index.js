// src/componentes/Cabecalho/index.js
import React, { useEffect, useState } from "react";
import "./Cabecalho.css";
import { Link, useNavigate } from "react-router-dom";
import { getUsuarioLogado, logout as authLogout } from "../../servicos/auth"; // Renomear logout para evitar conflito

const Cabecalho = ({ login_link, register_link }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarUsuario = () => {
      const usuarioArmazenado = getUsuarioLogado(); // Usar a função do serviço
      setUsuario(usuarioArmazenado);
    };

    carregarUsuario(); // Carregar na montagem inicial

    // Listener para storage para atualizar o cabeçalho se o login/logout ocorrer em outra aba
    window.addEventListener('storage', carregarUsuario);
    // Listener para um evento customizado que pode ser disparado após login/logout programático
    window.addEventListener('authChange', carregarUsuario);

    return () => {
        window.removeEventListener('storage', carregarUsuario);
        window.removeEventListener('authChange', carregarUsuario);
    };
  }, []);

  const handleLogout = () => {
    authLogout(); // Usar a função de logout do serviço
    setUsuario(null); // Atualizar estado local imediatamente
    navigate("/");
    window.dispatchEvent(new Event('authChange')); // Disparar evento para outros componentes
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDENTE_APROVACAO': return '(Pendente Aprovação)';
      case 'REJEITADO': return '(Conta Rejeitada)';
      default: return '';
    }
  };

  return (
    <header>
      <div className="header-content">
        <div className="left-group">
          <Link to="/">
            <img
              src="/imagens/logo.png"
              alt="ShareCondo Logo"
              className="share-condo-logo"
            />
          </Link>
          <ul className="nav-menu">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/quem-somos">Quem Somos</Link> {/* Página NotFound, mas o link existe */}
            </li>
            {/* Usuário só pode ver anúncios se estiver logado e APROVADO */}
            {usuario && usuario.statusUsuario === "APROVADO" && (
              <li>
                <Link to="/anuncios">Anúncios</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="right-group">
          {usuario ? (
            <>
              {usuario.statusUsuario === "APROVADO" && ( // Links de usuário só se aprovado
                <ul className="nav-menu user-actions-menu">
                  <li><Link to="/meus-anuncios">Meus Anúncios</Link></li>
                  <li><Link to="/minhas-ofertas">Minhas Ofertas</Link></li>
                  {usuario.tipoUsuario === "ADMIN" && (
                    <li><Link to="/admin">Console Admin</Link></li>
                  )}
                  {usuario.tipoUsuario === "SINDICO" && (
                    <li><Link to="/sindico/aprovar-usuarios">Aprovar Usuários</Link></li>
                  )}
                </ul>
              )}
              <span className="username">
                Olá, {usuario.nome}
                {usuario.tipoUsuario === "ADMIN" ? " (Admin)" : ""}
                {usuario.tipoUsuario === "SINDICO" ? ` (Síndico - ${usuario.condominioNome || 'Condomínio'})` : ""}
                {usuario.tipoUsuario === "USUARIO" ? ` (${usuario.condominioNome || 'Condomínio'})` : ""}
                {getStatusLabel(usuario.statusUsuario)}
              </span>
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