// src/paginas/MinhasOfertas/MinhasOfertasPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getOfertasPorUsuario } from '../../servicos/ofertas';
import { getUsuarioLogado } from '../../servicos/auth';
import './MinhasOfertas.css';

const MinhasOfertasPage = () => {
  const [minhasOfertas, setMinhasOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX: Usar useState para usuarioLogado para estabilizar sua referência
  const [usuarioLogado, setUsuarioLogado] = useState(() => getUsuarioLogado());

  const carregarMinhasOfertas = useCallback(async () => {
    if (!usuarioLogado || !usuarioLogado.id) {
      setError("Você precisa estar logado para ver suas ofertas.");
      setLoading(false);
      setMinhasOfertas([]); // Limpa dados anteriores
      return;
    }
    setLoading(true);
    try {
      const data = await getOfertasPorUsuario(usuarioLogado.id);
      setMinhasOfertas(data || []);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar minhas ofertas:", err);
      setError("Falha ao carregar suas ofertas. Tente novamente.");
      setMinhasOfertas([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioLogado]); // Agora depende do estado estável de usuarioLogado

  useEffect(() => {
    const currentUser = getUsuarioLogado();
    if (JSON.stringify(currentUser) !== JSON.stringify(usuarioLogado)) {
        setUsuarioLogado(currentUser);
    }
    carregarMinhasOfertas();
  }, [carregarMinhasOfertas]);

  if (!usuarioLogado && !loading) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Por favor, faça login para ver suas ofertas.</p>;
  }
  if (loading) return <p>Carregando suas ofertas...</p>;
   if (error && !usuarioLogado) {
      return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>;
  }
  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div className="minhas-ofertas-container">
      <h1>Minhas Ofertas Enviadas</h1>
      {minhasOfertas.length === 0 ? (
        <p>Você ainda não fez nenhuma oferta.</p>
      ) : (
        <ul className="lista-minhas-ofertas">
          {minhasOfertas.map(oferta => (
            <li key={oferta.id} className={`minha-oferta-card status-${oferta.status?.toLowerCase()}`}>
              <p><strong>Anúncio ID:</strong> {oferta.anuncioId}</p>
              {/* Você pode querer buscar detalhes do anúncio se necessário, ou incluí-los no OfertaResponseDTO */}
              <p><strong>Ofertante (Você):</strong> {oferta.ofertante?.nome}</p>
              <p><strong>Tipo de Oferta:</strong> {oferta.tipoOferta}</p>
              {oferta.tipoOferta === 'DINHEIRO' && <p><strong>Valor:</strong> R$ {oferta.valor?.toFixed(2)}</p>}
              {oferta.descricao && <p><strong>Sua Descrição:</strong> {oferta.descricao}</p>}
              <p><strong>Data da Oferta:</strong> {new Date(oferta.dataOferta).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${oferta.status?.toLowerCase()}`}>{oferta.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MinhasOfertasPage;