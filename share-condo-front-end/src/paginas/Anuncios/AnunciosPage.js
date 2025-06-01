// src/paginas/Anuncios/AnunciosPage.js
import React, { useState, useEffect } from 'react';
import AnuncioList from './AnuncioList';
import AddAnuncioModal from './AddAnuncioModal';
import OfferTradeModal from './OfferTradeModal';
import Button from '../../componentes/Botao/Button';
import './Anuncio.css'; 
import { getAnuncios, createAnuncio } from '../../servicos/anuncios';
import { createOfertaParaAnuncio } from '../../servicos/ofertas';
import { getUsuarioLogado } from '../../servicos/auth';

const AnunciosPage = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [currentAnuncioForOffer, setCurrentAnuncioForOffer] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  const usuarioLogado = getUsuarioLogado();

  const fetchAnuncios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnuncios();
      setAnuncios(data || []); 
    } catch (err) {
      console.error("Erro ao buscar anúncios:", err);
      setError("Falha ao carregar anúncios. Tente novamente.");
      setAnuncios([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const handleAddAnuncio = async (dadosNovoAnuncio) => {
    if (!usuarioLogado) {
      setFeedbackMessage({ type: 'error', text: 'Você precisa estar logado para criar um anúncio.' });
      return;
    }
    const payload = {
        titulo: dadosNovoAnuncio.titulo,
        descricao: dadosNovoAnuncio.descricao,
        tipoAnuncio: dadosNovoAnuncio.tipo.toUpperCase(), 
        ativo: true 
    };

    try {
      await createAnuncio(payload);
      setFeedbackMessage({ type: 'success', text: 'Anúncio adicionado com sucesso!' });
      fetchAnuncios(); 
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Erro ao adicionar anúncio:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao adicionar anúncio. Tente novamente.";
      setFeedbackMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleOpenOfferModal = (anuncio) => {
    if (!usuarioLogado) {
      setFeedbackMessage({ type: 'error', text: 'Você precisa estar logado para fazer uma oferta.' }); // Atualizado para usar feedbackMessage
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
      return;
    }
    if (usuarioLogado.id === anuncio.anunciante?.id) {
      setFeedbackMessage({ type: 'error', text: 'Você não pode fazer uma oferta no seu próprio anúncio.' }); // Atualizado
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
      return;
    }
    setCurrentAnuncioForOffer(anuncio);
    setIsOfferModalOpen(true);
  };

  const handleSendOffer = async (offerDataFrontend) => {
    if (!currentAnuncioForOffer || !currentAnuncioForOffer.id) {
        setFeedbackMessage({ type: 'error', text: 'Anúncio alvo não selecionado.' });
        return;
    }

    const payload = {
        tipoOferta: offerDataFrontend.tipoOferta.toUpperCase(),
        valor: offerDataFrontend.tipoOferta.toUpperCase() === 'DINHEIRO' ? parseFloat(offerDataFrontend.valor) : null,
        descricao: (offerDataFrontend.tipoOferta.toUpperCase() === 'ITEM' || offerDataFrontend.tipoOferta.toUpperCase() === 'SERVICO') ? offerDataFrontend.descricao : null,
    };
    
    try {
      await createOfertaParaAnuncio(currentAnuncioForOffer.id, payload);
      setFeedbackMessage({ type: 'success', text: 'Oferta enviada com sucesso!' });
      setIsOfferModalOpen(false);
      // Limpar mensagem após alguns segundos
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      console.error("Erro ao enviar oferta:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao enviar oferta. Tente novamente.";
      setFeedbackMessage({ type: 'error', text: errorMsg });
      // Limpar mensagem após alguns segundos
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
    }
  };

  // Filtrar anúncios ativos para exibição
  const anunciosAtivos = anuncios.filter(anuncio => anuncio.ativo);

  return (
    <div className="anuncios-page-container">
      <div className="anuncios-header">
        <h1>Anúncios de Troca</h1>
        {usuarioLogado && (
          <Button onClick={() => setIsAddModalOpen(true)} className="button-add">
            + Adicionar Novo Anúncio
          </Button>
        )}
      </div>

      {feedbackMessage.text && (
        <p className={`feedback-message ${feedbackMessage.type}`}>
          {feedbackMessage.text}
        </p>
      )}

      {loading && <p>Carregando anúncios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <AnuncioList anuncios={anunciosAtivos} onOfferTrade={handleOpenOfferModal} /> 
      )}

      <AddAnuncioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAnuncio={handleAddAnuncio}
      />

      {currentAnuncioForOffer && (
        <OfferTradeModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          anuncio={currentAnuncioForOffer}
          onSendOffer={handleSendOffer}
        />
      )}
    </div>
  );
};

export default AnunciosPage;