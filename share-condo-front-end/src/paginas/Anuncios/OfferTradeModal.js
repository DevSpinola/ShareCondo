// src/components/Anuncios/OfferTradeModal.js
import React, { useState } from 'react';
import Modal from '../../componentes/Modal/Modal';
import Button from '../../componentes/Botao/Button';

const OfferTradeModal = ({ isOpen, onClose, anuncio, onSendOffer }) => {
  const [offerType, setOfferType] = useState('dinheiro'); // dinheiro, servico, item
  const [offerDetails, setOfferDetails] = useState(''); // Para item ou serviço
  const [offerAmount, setOfferAmount] = useState('');   // Para dinheiro

  if (!anuncio) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // O anuncio.id já está disponível via prop 'anuncio'
    // O AnunciosPage.js (ou quem chama onSendOffer) cuidará de passar o anuncioId para o serviço.
    let offerDataPayload = {
      tipoOferta: offerType, // Será convertido para ENUM no AnunciosPage
      // Os campos 'valor' e 'descricao' serão usados condicionalmente
    };

    if (offerType === 'dinheiro') {
      if (!offerAmount || isNaN(parseFloat(offerAmount)) || parseFloat(offerAmount) <= 0) {
        alert('Por favor, insira um valor monetário válido.');
        return;
      }
      offerDataPayload.valor = parseFloat(offerAmount);
    } else { // item ou servico
      if (!offerDetails.trim()) {
        alert(`Por favor, forneça detalhes para a oferta de ${offerType}.`);
        return;
      }
      offerDataPayload.descricao = offerDetails;
    }

    // onSendOffer agora é chamado com os dados da oferta
    // e o AnunciosPage.js usará o 'anuncio.id' (currentAnuncioForOffer.id)
    onSendOffer(offerDataPayload); 
    
    // Limpar formulário e fechar modal
    setOfferType('dinheiro');
    setOfferDetails('');
    setOfferAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Fazer Oferta por: ${anuncio.titulo}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="offer-type">O que você quer oferecer em troca?</label>
          <select id="offer-type" value={offerType} onChange={(e) => setOfferType(e.target.value)}>
            <option value="dinheiro">Dinheiro</option>
            <option value="item">Outro Item</option>
            <option value="servico">Um Serviço</option>
          </select>
        </div>

        {offerType === 'dinheiro' && (
          <div className="form-group">
            <label htmlFor="offer-amount">Valor (R$):</label>
            <input
              type="number"
              id="offer-amount"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="Ex: 50.00"
              step="0.01"
              required
            />
          </div>
        )}

        {(offerType === 'item' || offerType === 'servico') && (
          <div className="form-group">
            <label htmlFor="offer-details">
              Descreva o {offerType === 'item' ? 'Item' : 'Serviço'} que você está oferecendo:
            </label>
            <textarea
              id="offer-details"
              value={offerDetails}
              onChange={(e) => setOfferDetails(e.target.value)}
              rows="3"
              required
            />
          </div>
        )}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button type="button" onClick={onClose} className="button-secondary" style={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button type="submit">Enviar Oferta</Button>
        </div>
      </form>
    </Modal>
  );
};

export default OfferTradeModal;