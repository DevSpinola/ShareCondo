// src/paginas/Sindico/AprovarUsuariosPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getUsuariosPendentes, aprovarUsuario, rejeitarUsuario } from '../../servicos/usuarios';
import { getUsuarioLogado } from '../../servicos/auth';
import Button from '../../componentes/Botao/Button';
import './AprovarUsuarios.css';

const AprovarUsuariosPage = () => {
  const [usuariosPendentes, setUsuariosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Usar useState para usuarioLogado para estabilizar sua referência
  const [usuarioLogado, setUsuarioLogado] = useState(() => getUsuarioLogado());

  // Efeito para re-sincronizar usuarioLogado se houver mudanças globais (ex: logout em outra aba)
  useEffect(() => {
    const handleAuthChange = () => {
      setUsuarioLogado(getUsuarioLogado());
    };
    // Evento 'storage' é disparado quando localStorage muda em outra aba/janela
    window.addEventListener('storage', handleAuthChange);
    // 'authChange' é um evento customizado que podemos disparar no logout/login no Cabecalho
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []); // Executa apenas uma vez para adicionar os listeners

  const carregarPendentes = useCallback(async () => {
    if (!usuarioLogado) {
      setError("Você precisa estar logado para acessar esta página.");
      setLoading(false);
      setUsuariosPendentes([]); // Limpar dados anteriores
      return;
    }

    if (usuarioLogado.tipoUsuario !== 'SINDICO' && usuarioLogado.tipoUsuario !== 'ADMIN') {
      setError("Acesso não autorizado.");
      setLoading(false);
      setUsuariosPendentes([]); // Limpar dados anteriores
      return;
    }

    setLoading(true);
    setError(null); // Limpar erros antes de nova busca
    try {
      const data = await getUsuariosPendentes();
      setUsuariosPendentes(data || []);
    } catch (err) {
      console.error("Erro ao buscar usuários pendentes:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Falha ao carregar usuários pendentes. Tente novamente.";
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      setUsuariosPendentes([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioLogado]); // Agora depende da referência estável de usuarioLogado do useState

  useEffect(() => {
    // Carregar pendentes apenas se usuarioLogado estiver definido.
    // A lógica de verificação de tipo de usuário já está dentro de carregarPendentes.
    if (usuarioLogado) {
      carregarPendentes();
    } else {
      // Define um estado apropriado se o usuário não estiver logado após a verificação inicial.
      setError("Você precisa estar logado para visualizar esta página.");
      setLoading(false);
      setUsuariosPendentes([]);
    }
  }, [carregarPendentes, usuarioLogado]); // Adicionado usuarioLogado aqui também para garantir que se ele mudar (ex: de null para objeto), carregarPendentes seja chamado.

  const handleAprovar = async (usuarioId) => {
    setFeedback({ message: '', type: '' }); // Limpar feedback
    try {
      await aprovarUsuario(usuarioId);
      setFeedback({ message: 'Usuário aprovado com sucesso!', type: 'success' });
      carregarPendentes(); // Recarregar a lista
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao aprovar usuário.";
      setFeedback({ message: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), type: 'error' });
    }
  };

  const handleRejeitar = async (usuarioId) => {
    setFeedback({ message: '', type: '' }); // Limpar feedback
    try {
      await rejeitarUsuario(usuarioId);
      setFeedback({ message: 'Usuário rejeitado com sucesso!', type: 'success' });
      carregarPendentes(); // Recarregar a lista
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao rejeitar usuário.";
      setFeedback({ message: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), type: 'error' });
    }
  };

  // Lógica de Renderização
  if (loading && !usuarioLogado) { 
    // Estado inicial enquanto usuarioLogado ainda não foi definido pelo useState/useEffect
    return <div className="aprovar-usuarios-container"><p>Verificando autenticação...</p></div>;
  }

  if (!usuarioLogado) {
    return <div className="aprovar-usuarios-container"><p>{error || "Por favor, faça login."}</p></div>;
  }
  
  if (usuarioLogado.tipoUsuario !== 'SINDICO' && usuarioLogado.tipoUsuario !== 'ADMIN') {
    return <div className="aprovar-usuarios-container"><p>{error || "Você não tem permissão para acessar esta página."}</p></div>;
  }
  
  if (loading) { // Loading de dados após autenticação verificada
    return <div className="aprovar-usuarios-container"><p>Carregando usuários pendentes...</p></div>;
  }
  
  if (error) { // Erro na busca de dados, mesmo autenticado e autorizado
    return <div className="aprovar-usuarios-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="aprovar-usuarios-container">
      <h1>Aprovar Cadastros de Novos Moradores</h1>
      {usuarioLogado.tipoUsuario === 'SINDICO' && (
        <p><strong>Condomínio:</strong> {usuarioLogado.condominioNome || 'Não especificado'}</p>
      )}
      {feedback.message && (
        <p className={`feedback ${feedback.type}`}>{feedback.message}</p>
      )}
      {usuariosPendentes.length === 0 ? (
        <p>Nenhum usuário pendente de aprovação no momento.</p>
      ) : (
        <ul className="lista-usuarios-pendentes">
          {usuariosPendentes.map(usuario => (
            <li key={usuario.id} className="usuario-pendente-card">
              <p><strong>Nome:</strong> {usuario.nome}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              {usuarioLogado.tipoUsuario === 'ADMIN' && usuario.condominioNome && (
                <p><strong>Condomínio Solicitado:</strong> {usuario.condominioNome}</p>
              )}
              <div className="acoes-usuario">
                <Button onClick={() => handleAprovar(usuario.id)} className="button-success">Aprovar</Button>
                <Button onClick={() => handleRejeitar(usuario.id)} className="button-danger">Rejeitar</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AprovarUsuariosPage;