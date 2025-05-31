// src/components/Anuncios/AddAnuncioModal.js
import React, { useState } from 'react';
import Modal from '../../componentes/Modal/Modal';
import Button from '../../componentes/Botao/Button';
// Importe seu FormInput se quiser usá-lo aqui, ou crie inputs simples
// import FormInput from '../FormInput';

const AddAnuncioModal = ({ isOpen, onClose, onAddAnuncio }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('item'); // 'item' ou 'servico'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) {
      alert('Por favor, preencha o título e a descrição.');
      return;
    }
    // Em um app real, você teria mais validações e talvez um ID gerado pelo backend
    onAddAnuncio({ id: Date.now(), titulo, descricao, tipo, usuario: 'Usuário Logado' }); // Adicionar info do usuário logado
    setTitulo('');
    setDescricao('');
    setTipo('item');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Anúncio de Troca">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="anuncio-titulo">Título do Anúncio:</label>
          <input
            type="text"
            id="anuncio-titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="anuncio-descricao">Descrição:</label>
          <textarea
            id="anuncio-descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="anuncio-tipo">Tipo de Anúncio:</label>
          <select id="anuncio-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="item">Item</option>
            <option value="servico">Serviço</option>
          </select>
        </div>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button type="button" onClick={onClose} className="button-secondary" style={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button type="submit">Adicionar Anúncio</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAnuncioModal;