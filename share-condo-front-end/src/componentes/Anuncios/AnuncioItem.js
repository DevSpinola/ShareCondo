// src/components/Anuncios/AnuncioItem.js
import React from 'react';
import Button from '../UI/Button';
import './Anuncio.css'; // Criaremos este CSS

const AnuncioItem = ({ anuncio, onOfferTrade }) => {
  return (
    <div className="anuncio-card">
      <h3>{anuncio.titulo}</h3>
      <p className="anuncio-tipo">
        <strong>Tipo:</strong> {anuncio.tipo === 'item' ? 'Item' : 'Serviço'}
      </p>
      <p className="anuncio-descricao">{anuncio.descricao}</p>
      <p className="anuncio-usuario">
        <em>Publicado por: {anuncio.usuario || 'Desconhecido'}</em>
      </p>
      <Button onClick={() => onOfferTrade(anuncio)}>Fazer Oferta</Button>
    </div>
  );
};

export default AnuncioItem;