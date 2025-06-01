// src/paginas/AnuncioDetalhe/AnuncioDetalhePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnuncioById } from '../../servicos/anuncios';
import { createOfertaParaAnuncio } from '../../servicos/ofertas'; // Importar serviço de oferta
import { getUsuarioLogado } from '../../servicos/auth';
import OfferTradeModal from '../Anuncios/OfferTradeModal'; // Reutilizar o modal
import Button from '../../componentes/Botao/Button';
import Corpo from '../../componentes/Corpo';
import './AnuncioDetalhe.css';

const AnuncioDetalhePage = () => {
  const { id: anuncioId } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  const usuarioLogado = getUsuarioLogado();

  const fetchAnuncioDetalhe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnuncioById(anuncioId);
      setAnuncio(data);
    } catch (err) {
      console.error("Erro ao buscar detalhes do anúncio:", err);
      setError("Falha ao carregar detalhes do anúncio. Tente novamente ou verifique o ID.");
      setAnuncio(null);
    } finally {
      setLoading(false);
    }
  }, [anuncioId]);

  useEffect(() => {
    fetchAnuncioDetalhe();
  }, [fetchAnuncioDetalhe]);

  const handleOpenOfferModal = () => {
    if (!usuarioLogado) {
      setFeedbackMessage({ type: 'error', text: 'Você precisa estar logado para fazer uma oferta.' });
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
      return;
    }
    if (anuncio && usuarioLogado.id === anuncio.anunciante?.id) {
      setFeedbackMessage({ type: 'error', text: 'Você não pode fazer uma oferta no seu próprio anúncio.' });
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
      return;
    }
    setIsOfferModalOpen(true);
  };

  const handleSendOffer = async (offerDataFrontend) => {
    if (!anuncio || !anuncio.id) {
      setFeedbackMessage({ type: 'error', text: 'Anúncio alvo não selecionado.' });
      return;
    }

    const payload = {
      tipoOferta: offerDataFrontend.tipoOferta.toUpperCase(),
      valor: offerDataFrontend.tipoOferta.toUpperCase() === 'DINHEIRO' ? parseFloat(offerDataFrontend.valor) : null,
      descricao: (offerDataFrontend.tipoOferta.toUpperCase() === 'ITEM' || offerDataFrontend.tipoOferta.toUpperCase() === 'SERVICO') ? offerDataFrontend.descricao : null,
    };

    try {
      await createOfertaParaAnuncio(anuncio.id, payload);
      setFeedbackMessage({ type: 'success', text: 'Oferta enviada com sucesso!' });
      setIsOfferModalOpen(false);
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      console.error("Erro ao enviar oferta:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Erro ao enviar oferta. Tente novamente.";
      setFeedbackMessage({ type: 'error', text: errorMsg });
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
    }
  };


  if (loading) return <Corpo><p className="anuncio-detalhe-mensagem">Carregando detalhes do anúncio...</p></Corpo>;
  if (error) return <Corpo><p className="anuncio-detalhe-mensagem error">{error}</p></Corpo>;
  if (!anuncio) return <Corpo><p className="anuncio-detalhe-mensagem">Anúncio não encontrado.</p></Corpo>;

  const nomeAnunciante = anuncio.anunciante?.nome || 'Desconhecido';
  const podeFazerOferta = usuarioLogado && anuncio.ativo && usuarioLogado.id !== anuncio.anunciante?.id;

  return (
    <Corpo>
      <div className="anuncio-detalhe-container">
        {feedbackMessage.text && (
          <p className={`feedback-message ${feedbackMessage.type} anuncio-detalhe-feedback`}>
            {feedbackMessage.text}
          </p>
        )}
        <div className={`anuncio-detalhe-card ${!anuncio.ativo ? 'inativo' : ''}`}>
          <header className="anuncio-detalhe-header">
            <h1>{anuncio.titulo}</h1>
            <span className={`status-anuncio ${anuncio.ativo ? 'ativo' : 'inativo'}`}>
              {anuncio.ativo ? 'Ativo' : 'Concluído/Inativo'}
            </span>
          </header>
          <div className="anuncio-info">
            <p><strong>Tipo:</strong> {anuncio.tipoAnuncio === 'ITEM' ? 'Item' : 'Serviço'}</p>
            <p><strong>Publicado por:</strong> {nomeAnunciante} (Email: {anuncio.anunciante?.email || 'N/A'})</p>
            <p><strong>Data de Criação:</strong> {new Date(anuncio.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="anuncio-descricao-completa">
            <h2>Descrição Detalhada</h2>
            <p>{anuncio.descricao}</p>
          </div>

          {podeFazerOferta && (
            <Button onClick={handleOpenOfferModal} className="button-primary button-fazer-oferta">
              Fazer Oferta
            </Button>
          )}
          {!anuncio.ativo && <p className="anuncio-inativo-aviso">Este anúncio não está mais ativo e não aceita novas ofertas.</p>}

          {/* Seção para mostrar ofertas (opcional, e depende se o usuário é o dono) */}
          {/* Esta parte é mais relevante para a página "MeusAnuncios", mas pode ser adaptada */}
          {/*
          {usuarioLogado && usuarioLogado.id === anuncio.anunciante?.id && anuncio.ofertasRecebidas && anuncio.ofertasRecebidas.length > 0 && (
            <div className="ofertas-recebidas-detalhe">
              <h2>Ofertas Recebidas</h2>
              <ul>
                {anuncio.ofertasRecebidas.map(oferta => (
                  <li key={oferta.id} className={`oferta-item-detalhe status-${oferta.status?.toLowerCase()}`}>
                    <p><strong>Ofertante:</strong> {oferta.ofertante?.nome} ({oferta.ofertante?.email})</p>
                    <p><strong>Tipo:</strong> {oferta.tipoOferta} {oferta.tipoOferta === 'DINHEIRO' ? `- R$ ${oferta.valor?.toFixed(2)}` : ''}</p>
                    {oferta.descricao && <p><strong>Descrição da Oferta:</strong> {oferta.descricao}</p>}
                    <p><strong>Status:</strong> {oferta.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          */}
        </div>
      </div>
      {isOfferModalOpen && anuncio && (
        <OfferTradeModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          anuncio={anuncio} // Passa o anúncio completo para o modal
          onSendOffer={handleSendOffer}
        />
      )}
    </Corpo>
  );
};

export default AnuncioDetalhePage;