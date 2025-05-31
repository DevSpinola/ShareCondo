// src/components/Anuncios/AnunciosPage.js
import React, { useState, useEffect } from 'react';
import AnuncioList from './AnuncioList';
import AddAnuncioModal from './AddAnuncioModal';
import OfferTradeModal from './OfferTradeModal';
import Button from '../../componentes/Botao/Button';
import './Anuncio.css'; // Para estilização da página de anúncios
// Importar os serviços
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
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' }); // Para sucesso/erro

  const usuarioLogado = getUsuarioLogado();

  const fetchAnuncios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnuncios();
      setAnuncios(data || []); // Garante que seja um array
    } catch (err) {
      console.error("Erro ao buscar anúncios:", err);
      setError("Falha ao carregar anúncios. Tente novamente.");
      setAnuncios([]); // Define como array vazio em caso de erro
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
    // O backend irá associar o usuário logado automaticamente
    // O DTO Request para anuncio é: titulo, descricao, tipoAnuncio, ativo (opcional)
    const payload = {
        titulo: dadosNovoAnuncio.titulo,
        descricao: dadosNovoAnuncio.descricao,
        tipoAnuncio: dadosNovoAnuncio.tipo.toUpperCase(), // Assumindo que o backend espera enum em maiúsculo
        ativo: true // Ou conforme o modal enviar
    };

    try {
      await createAnuncio(payload);
      setFeedbackMessage({ type: 'success', text: 'Anúncio adicionado com sucesso!' });
      fetchAnuncios(); // Recarrega a lista de anúncios
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Erro ao adicionar anúncio:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao adicionar anúncio. Tente novamente.";
      setFeedbackMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleOpenOfferModal = (anuncio) => {
    if (!usuarioLogado) {
      alert('Você precisa estar logado para fazer uma oferta.');
      return;
    }
    if (usuarioLogado.id === anuncio.anunciante?.id) {
      alert('Você não pode fazer uma oferta no seu próprio anúncio.');
      return;
    }
    setCurrentAnuncioForOffer(anuncio);
    setIsOfferModalOpen(true);
  };

  const handleSendOffer = async (offerDataFrontend) => {
    // offerDataFrontend vem do OfferTradeModal e pode ter: anuncioId, tipoOferta, valor, descricao
    // O backend espera no OfertaRequestDTO: tipoOferta, valor, descricao
    // O anuncioId vai na URL
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
      // Aqui você pode querer atualizar algo na UI ou apenas notificar o usuário
    } catch (err) {
      console.error("Erro ao enviar oferta:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao enviar oferta. Tente novamente.";
      setFeedbackMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="anuncios-page-container">
      <div className="anuncios-header">
        <h1>Anúncios de Troca</h1>
        {usuarioLogado && (
          <Button onClick={() => setIsAddModalOpen(true)}>
            + Adicionar Novo Anúncio
          </Button>
        )}
      </div>

      {feedbackMessage.text && (
        <p style={{ color: feedbackMessage.type === 'error' ? 'red' : 'green' }}>
          {feedbackMessage.text}
        </p>
      )}

      {loading && <p>Carregando anúncios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <AnuncioList anuncios={anuncios} onOfferTrade={handleOpenOfferModal} />
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