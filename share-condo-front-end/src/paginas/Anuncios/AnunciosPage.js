// src/components/Anuncios/AnunciosPage.js
import React, { useState, useEffect } from 'react';
import AnuncioList from './AnuncioList';
import AddAnuncioModal from './AddAnuncioModal';
import OfferTradeModal from './OfferTradeModal';
import Button from '../../componentes/Botao/Button';
import './Anuncio.css'; // Para estilização da página de anúncios
// import axios from 'axios'; // Descomente quando for integrar com API

const AnunciosPage = () => {
  const [anuncios, setAnuncios] = useState([
    // Dados de exemplo iniciais
    { id: '1', titulo: 'Furadeira potente', descricao: 'Pouco usada, ideal para pequenos reparos.', tipo: 'item', usuario: 'Carlos Silva' },
    { id: '2', titulo: 'Aula de Violão', descricao: 'Aulas para iniciantes, método fácil.', tipo: 'servico', usuario: 'Mariana Costa' },
    { id: '3', titulo: 'Coleção de Livros de Fantasia', descricao: '10 livros em ótimo estado.', tipo: 'item', usuario: 'Pedro Almeida' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [currentAnuncioForOffer, setCurrentAnuncioForOffer] = useState(null);

  // Simulação de busca de dados da API
  // useEffect(() => {
  //   const fetchAnuncios = async () => {
  //     try {
  //       // const response = await axios.get('/api/anuncios'); // Sua chamada API
  //       // setAnuncios(response.data);
  //     } catch (error) {
  //       console.error("Erro ao buscar anúncios:", error);
  //     }
  //   };
  //   fetchAnuncios();
  // }, []);

  const handleAddAnuncio = (novoAnuncio) => {
    // Lógica para adicionar o anúncio (ex: chamada API e atualização do estado)
    const anuncioComId = { ...novoAnuncio, id: String(Date.now()) }; // ID temporário
    setAnuncios(prevAnuncios => [anuncioComId, ...prevAnuncios]);
    console.log("Novo anúncio para adicionar:", anuncioComId);
    // setIsAddModalOpen(false); // Modal já fecha internamente
  };

  const handleOpenOfferModal = (anuncio) => {
    setCurrentAnuncioForOffer(anuncio);
    setIsOfferModalOpen(true);
  };

  const handleSendOffer = (offerData) => {
    // Lógica para enviar a oferta (ex: chamada API)
    console.log("Oferta enviada para o anúncio:", currentAnuncioForOffer?.id, offerData);
    // setIsOfferModalOpen(false); // Modal já fecha internamente
  };

  return (
    <div className="anuncios-page-container">
      <div className="anuncios-header">
        <h1>Anúncios de Troca</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Adicionar Novo Anúncio
        </Button>
      </div>

      <AnuncioList anuncios={anuncios} onOfferTrade={handleOpenOfferModal} />

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