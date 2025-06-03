// src/paginas/MinhasOfertas/MinhasOfertasPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // <-- ADICIONAR IMPORTAÇÃO
import { getOfertasPorUsuario } from '../../servicos/ofertas';
import { getUsuarioLogado } from '../../servicos/auth';
import './MinhasOfertas.css';

const MinhasOfertasPage = () => {
  const [minhasOfertas, setMinhasOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(() => getUsuarioLogado());

  const carregarMinhasOfertas = useCallback(async () => {
    if (!usuarioLogado || !usuarioLogado.id) {
      setError("Você precisa estar logado para ver suas ofertas.");
      setLoading(false);
      setMinhasOfertas([]);
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
  }, [usuarioLogado]);

  useEffect(() => {
    const currentUser = getUsuarioLogado();
    if (JSON.stringify(currentUser) !== JSON.stringify(usuarioLogado)) {
        setUsuarioLogado(currentUser);
    }
    // A chamada para carregarMinhasOfertas é feita dentro do useEffect que depende de usuarioLogado
  }, [usuarioLogado]); // Adicionado usuarioLogado como dependência

  useEffect(() => { // Separado para chamar apenas quando carregarMinhasOfertas muda
    carregarMinhasOfertas();
  }, [carregarMinhasOfertas]);


  if (!usuarioLogado && !loading) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Por favor, faça login para ver suas ofertas.</p>;
  }
  if (loading) return <p className="minhas-ofertas-container">Carregando suas ofertas...</p>; // Adicionada classe para estilização
  if (error && !usuarioLogado) { // Adicionada classe para estilização
      return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }} className="minhas-ofertas-container">{error}</p>;
  }
  if (error) return <p style={{ color: 'red' }} className="minhas-ofertas-container">{error}</p>; // Adicionada classe


  return (
    <div className="minhas-ofertas-container">
      <h1>Minhas Ofertas Enviadas</h1>
      {minhasOfertas.length === 0 && !loading ? ( // Adicionado !loading para evitar piscar
        <p>Você ainda não fez nenhuma oferta.</p>
      ) : (
        <ul className="lista-minhas-ofertas">
          {minhasOfertas.map(oferta => (
            <li key={oferta.id} className={`minha-oferta-card status-${oferta.status?.toLowerCase()}`}>
              <p className="detalhe-oferta">
                <strong>Anúncio:</strong> {/* Texto alterado */}
                <Link to={`/anuncios/${oferta.anuncioId}`} className="link-anuncio-detalhe">
                  Ver Detalhes do Anúncio (ID: {oferta.anuncioId})
                </Link>
              </p>
              <p className="detalhe-oferta"><strong>Ofertante (Você):</strong> {oferta.ofertante?.nome}</p>
              <p className="detalhe-oferta"><strong>Tipo de Oferta:</strong> {oferta.tipoOferta}</p>
              {oferta.tipoOferta === 'DINHEIRO' && <p className="detalhe-oferta"><strong>Valor:</strong> R$ {oferta.valor?.toFixed(2)}</p>}
              {oferta.descricao && <p className="detalhe-oferta"><strong>Sua Descrição:</strong> {oferta.descricao}</p>}
              <p className="detalhe-oferta"><strong>Data da Oferta:</strong> {new Date(oferta.dataOferta).toLocaleString()}</p>
              <p className="detalhe-oferta">
                <strong>Status:</strong> <span className={`status-badge status-${oferta.status?.toLowerCase()}`}>{oferta.status}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MinhasOfertasPage;