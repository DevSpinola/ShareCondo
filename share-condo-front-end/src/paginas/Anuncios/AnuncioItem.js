// src/paginas/Anuncios/AnuncioItem.js
import React from 'react';
import { Link } from 'react-router-dom'; // <-- ADICIONAR IMPORTAÇÃO
import Button from '../../componentes/Botao/Button';
import './Anuncio.css';

const AnuncioItem = ({ anuncio, onOfferTrade }) => {
  const nomeAnunciante = anuncio?.anunciante?.nome || 'Desconhecido';

  return (
    <div className="anuncio-card">
      <Link to={`/anuncios/${anuncio.id}`} className="anuncio-card-link-titulo"> {/* Link envolvendo o título */}
        <h3>{anuncio.titulo}</h3>
      </Link>
      <p className="anuncio-tipo">
        <strong>Tipo:</strong> {anuncio.tipoAnuncio === 'ITEM' ? 'Item' : 'Serviço'}
      </p>
      <p className="anuncio-descricao">{anuncio.descricao.substring(0, 100)}{anuncio.descricao.length > 100 ? "..." : ""}</p> {/* Limita a descrição */}
      <p className="anuncio-usuario">
        <em>Publicado por: {nomeAnunciante}</em>
      </p>
      <div className="anuncio-card-actions">
        <Link to={`/anuncios/${anuncio.id}`} style={{ marginRight: '10px' }}>
            <Button className="button-small">Ver Detalhes</Button>
        </Link>
        <Button onClick={() => onOfferTrade(anuncio)} className="button-primary button-small">Fazer Oferta</Button>
      </div>
    </div>
  );
};

export default AnuncioItem;