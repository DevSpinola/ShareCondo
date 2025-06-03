// src/paginas/MeusAnuncios/MeusAnunciosPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { getAnunciosDoUsuarioLogado, updateAnuncio } from '../../servicos/anuncios'; // Added updateAnuncio
import { aceitarOferta, recusarOferta } from '../../servicos/ofertas';
import { getUsuarioLogado } from '../../servicos/auth';
import Button from '../../componentes/Botao/Button';
import './MeusAnuncios.css';

const MeusAnunciosPage = () => {
  const [meusAnuncios, setMeusAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const [usuarioLogado, setUsuarioLogado] = useState(() => getUsuarioLogado());

  const carregarMeusAnuncios = useCallback(async () => {
    if (!usuarioLogado) {
      setError("Você precisa estar logado para ver seus anúncios.");
      setLoading(false);
      setMeusAnuncios([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getAnunciosDoUsuarioLogado();
      setMeusAnuncios(data || []);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar meus anúncios:", err);
      setError("Falha ao carregar seus anúncios. Tente novamente.");
      setMeusAnuncios([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioLogado]);

  useEffect(() => {
    const currentUser = getUsuarioLogado();
    if (JSON.stringify(currentUser) !== JSON.stringify(usuarioLogado)) {
        setUsuarioLogado(currentUser);
    }
    carregarMeusAnuncios();
  }, [carregarMeusAnuncios]);

  const handleAceitarOferta = async (ofertaId) => {
    setFeedback({ message: '', type: '' });
    try {
      await aceitarOferta(ofertaId);
      setFeedback({ message: 'Oferta aceita com sucesso! O anúncio foi desativado.', type: 'success' });
      carregarMeusAnuncios(); 
    } catch (err) {
      console.error("Erro ao aceitar oferta:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao aceitar oferta.";
      setFeedback({ message: errorMsg, type: 'error' });
    }
  };

  const handleRecusarOferta = async (ofertaId) => {
    setFeedback({ message: '', type: '' });
    try {
      await recusarOferta(ofertaId);
      setFeedback({ message: 'Oferta recusada com sucesso!', type: 'success' });
      carregarMeusAnuncios(); 
    } catch (err) {
      console.error("Erro ao recusar oferta:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao recusar oferta.";
      setFeedback({ message: errorMsg, type: 'error' });
    }
  };

  const handleDesativarAnuncio = async (anuncioId) => {
    setFeedback({ message: '', type: '' });
    // Find the announcement to get its current data for the update payload
    const anuncioParaDesativar = meusAnuncios.find(anuncio => anuncio.id === anuncioId);
    if (!anuncioParaDesativar) {
        setFeedback({ message: 'Anúncio não encontrado para desativação.', type: 'error'});
        return;
    }

    // Prepare payload for deactivation, keeping other fields intact
    const payload = {
        titulo: anuncioParaDesativar.titulo,
        descricao: anuncioParaDesativar.descricao,
        tipoAnuncio: anuncioParaDesativar.tipoAnuncio,
        ativo: false // Explicitly set to false
    };
    
    try {
      await updateAnuncio(anuncioId, payload);
      setFeedback({ message: 'Anúncio desativado com sucesso!', type: 'success' });
      carregarMeusAnuncios(); // Recarregar a lista
    } catch (err) {
      console.error("Erro ao desativar anúncio:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao desativar anúncio.";
      setFeedback({ message: errorMsg, type: 'error' });
    }
  };

  const podeModificarAnuncio = (anuncio) => {
    if (!usuarioLogado || !anuncio) return false;
    if (usuarioLogado.id === anuncio.anunciante?.id) return true; // Owner
    if (usuarioLogado.tipoUsuario === 'ADMIN') return true; // Admin
    if (usuarioLogado.tipoUsuario === 'SINDICO' && 
        usuarioLogado.condominioId === anuncio.anunciante?.condominioId) { // Sindico do mesmo condomínio
        return true;
    }
    return false;
  }


  if (!usuarioLogado && !loading) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Por favor, faça login para ver seus anúncios.</p>;
  }
  if (loading) return <p>Carregando seus anúncios...</p>;
  if (error && !usuarioLogado) {
      return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>;
  }
   if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div className="meus-anuncios-container">
      <h1>Meus Anúncios</h1>
      {feedback.message && (
        <p className={`feedback ${feedback.type}`}>{feedback.message}</p>
      )}
      {meusAnuncios.length === 0 ? (
        <p>Você ainda não criou nenhum anúncio.</p>
      ) : (
        meusAnuncios.map(anuncio => (
          <div key={anuncio.id} className={`meu-anuncio-card ${!anuncio.ativo ? 'inativo' : ''}`}>
            <div className="meu-anuncio-header">
                <h3>{anuncio.titulo} ({anuncio.ativo ? 'Ativo' : 'Concluído/Inativo'})</h3>
                <p><strong>Tipo:</strong> {anuncio.tipoAnuncio === 'ITEM' ? 'Item' : 'Serviço'}</p>
                {anuncio.ativo && podeModificarAnuncio(anuncio) && (
                  <Button 
                    onClick={() => handleDesativarAnuncio(anuncio.id)} 
                    className="button-deactivate" 
                    style={{ marginLeft: 'auto', padding: '5px 10px', fontSize: '0.9em' }} // Basic styling
                  >
                    Desativar Anúncio
                  </Button>
                )}
            </div>
            <p className="meu-anuncio-descricao">{anuncio.descricao}</p>
            <p><strong>Criado em:</strong> {new Date(anuncio.dataCriacao).toLocaleDateString()}</p>
            
            <h4>Ofertas Recebidas:</h4>
            {anuncio.ofertasRecebidas && anuncio.ofertasRecebidas.length > 0 ? (
              <ul className="lista-ofertas-recebidas">
                {anuncio.ofertasRecebidas.map(oferta => (
                  <li key={oferta.id} className={`oferta-item status-${oferta.status?.toLowerCase()}`}>
                    <p><strong>Ofertante:</strong> {oferta.ofertante?.nome || 'N/A'} ({oferta.ofertante?.email || 'N/A'})</p>
                    <p><strong>Tipo de Oferta:</strong> {oferta.tipoOferta}</p>
                    {oferta.tipoOferta === 'DINHEIRO' && <p><strong>Valor:</strong> R$ {oferta.valor?.toFixed(2)}</p>}
                    {oferta.descricao && <p><strong>Descrição da Oferta:</strong> {oferta.descricao}</p>}
                    <p><strong>Data:</strong> {new Date(oferta.dataOferta).toLocaleString()}</p>
                    <p><strong>Status:</strong> {oferta.status}</p>
                    {anuncio.ativo && oferta.status === 'PENDENTE' && podeModificarAnuncio(anuncio) && (
                      <div className="oferta-actions">
                        <Button onClick={() => handleAceitarOferta(oferta.id)} className="button-accept">Aceitar</Button>
                        <Button onClick={() => handleRecusarOferta(oferta.id)} className="button-reject">Recusar</Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma oferta recebida para este anúncio ainda.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MeusAnunciosPage;