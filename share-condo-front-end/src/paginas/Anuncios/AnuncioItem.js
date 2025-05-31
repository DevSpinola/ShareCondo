// src/components/Anuncios/AnuncioItem.js
import React from 'react';
import Button from '../../componentes/Botao/Button';
import './Anuncio.css'; // Criaremos este CSS

const AnuncioItem = ({ anuncio, onOfferTrade }) => {
  // Verifica se 'anuncio' e 'anunciante' existem e se 'nome' está disponível
  const nomeAnunciante = anuncio?.anunciante?.nome || 'Desconhecido';

  return (
    <div className="anuncio-card">
      <h3>{anuncio.titulo}</h3>
      <p className="anuncio-tipo">
        <strong>Tipo:</strong> {anuncio.tipoAnuncio === 'ITEM' ? 'Item' : 'Serviço'} {/* Ajustado para usar tipoAnuncio do DTO */}
      </p>
      <p className="anuncio-descricao">{anuncio.descricao}</p>
      <p className="anuncio-usuario">
        <em>Publicado por: {nomeAnunciante}</em> {/* Alteração aqui */}
      </p>
      <Button onClick={() => onOfferTrade(anuncio)}>Fazer Oferta</Button>
    </div>
  );
};

export default AnuncioItem;