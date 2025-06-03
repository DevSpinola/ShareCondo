// src/components/Anuncios/AnuncioList.js
import React from 'react';
import AnuncioItem from './AnuncioItem';
import './Anuncio.css';

const AnuncioList = ({ anuncios, onOfferTrade }) => {
  if (!anuncios || anuncios.length === 0) {
    return <p>Nenhum anúncio disponível no momento.</p>;
  }

  return (
    <div className="anuncios-grid">
      {anuncios.map(anuncio => (
        <AnuncioItem key={anuncio.id} anuncio={anuncio} onOfferTrade={onOfferTrade} />
      ))}
    </div>
  );
};

export default AnuncioList;