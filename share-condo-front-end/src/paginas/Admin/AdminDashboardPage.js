// src/paginas/Admin/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../servicos/dashboardService';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError('');
      } catch (err) {
        console.error("Erro ao buscar estatísticas do dashboard:", err);
        setError("Falha ao carregar estatísticas. Tente novamente mais tarde.");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const calculatePercentage = (part, whole) => {
    if (whole === 0 || part === 0) return 0;
    return Math.min((part / whole) * 100, 100); // Garante que não passe de 100%
  };

  return (
    <div className="admin-dashboard">
      <h1>Painel de Controle Administrativo</h1>
      <img src="/imagens/admin.png" alt="Painel Administrativo ShareCondo" className="admin-dashboard-image" />
      
      {loading && <p className="loading-message">Carregando estatísticas...</p>}
      {error && <p className="error-message">{error}</p>}

      {stats && (
        <div className="dashboard-stats-grid">
          {/* Card de Usuários */}
          <div className="stat-card">
            <h3>Usuários</h3>
            <p className="stat-value">{stats.totalUsuarios}</p>
            <p className="stat-detail">Total Cadastrados</p>
            {stats.totalUsuarios > 0 && (
              <>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar-filled users-pending"
                    style={{ width: `${calculatePercentage(stats.usuariosPendentes, stats.totalUsuarios)}%` }}
                    title={`${stats.usuariosPendentes} Pendentes`}
                  ></div>
                </div>
                <p className="stat-sub-detail">
                  {stats.usuariosPendentes} Pendentes ({calculatePercentage(stats.usuariosPendentes, stats.totalUsuarios).toFixed(1)}%)
                </p>
              </>
            )}
          </div>

          {/* Card de Condomínios */}
          <div className="stat-card">
            <h3>Condomínios</h3>
            <p className="stat-value">{stats.totalCondominios}</p>
            <p className="stat-detail">Total Registrados</p>
            {/* Barra de progresso não aplicável diretamente sem um "total" de referência maior ou meta */}
            <div className="stat-bar-container neutral-bar">
              <div className="stat-bar-filled condos" style={{ width: '100%' }}></div>
            </div>
             <p className="stat-sub-detail">&nbsp;</p> {/* Para manter alinhamento */}
          </div>

          {/* Card de Anúncios */}
          <div className="stat-card">
            <h3>Anúncios</h3>
            <p className="stat-value">{stats.totalAnuncios}</p>
            <p className="stat-detail">Total Criados</p>
            {stats.totalAnuncios > 0 && (
              <>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar-filled anuncios-ativos"
                    style={{ width: `${calculatePercentage(stats.anunciosAtivos, stats.totalAnuncios)}%` }}
                    title={`${stats.anunciosAtivos} Ativos`}
                  ></div>
                </div>
                <p className="stat-sub-detail">
                  {stats.anunciosAtivos} Ativos ({calculatePercentage(stats.anunciosAtivos, stats.totalAnuncios).toFixed(1)}%)
                </p>
              </>
            )}
          </div>

          {/* Card de Ofertas */}
          <div className="stat-card">
            <h3>Ofertas</h3>
            <p className="stat-value">{stats.totalOfertas}</p>
            <p className="stat-detail">Total Recebidas</p>
            {stats.totalOfertas > 0 && (
              <>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar-filled ofertas-pendentes"
                    style={{ width: `${calculatePercentage(stats.ofertasPendentes, stats.totalOfertas)}%` }}
                    title={`${stats.ofertasPendentes} Pendentes`}
                  ></div>
                </div>
                <p className="stat-sub-detail">
                  {stats.ofertasPendentes} Pendentes ({calculatePercentage(stats.ofertasPendentes, stats.totalOfertas).toFixed(1)}%)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <p className="dashboard-intro-text">
        Bem-vindo à área administrativa do ShareCondo!
      </p>
      <p className="dashboard-intro-text">
        A partir daqui, você tem o poder de gerenciar todos os aspectos da plataforma.
        Utilize o menu ao lado para navegar entre as diferentes seções:
      </p>
      <ul className="dashboard-features-list">
        <li><strong>Gerenciar Usuários:</strong> Visualize, edite, aprove, rejeite ou remova contas de usuários.</li>
        <li><strong>Gerenciar Condomínios:</strong> Adicione novos condomínios ou atualize informações dos existentes.</li>
        <li><strong>Gerenciar Anúncios:</strong> Modere e gerencie todos os anúncios criados na plataforma.</li>
        <li><strong>Gerenciar Ofertas:</strong> Visualize e, se necessário, intervenha nas ofertas realizadas.</li>
      </ul>
      <p className="dashboard-footer-text">
        Use estas ferramentas com responsabilidade para manter a plataforma segura, organizada e funcional para todos os membros da comunidade ShareCondo.
      </p>
    </div>
  );
};

export default AdminDashboardPage;