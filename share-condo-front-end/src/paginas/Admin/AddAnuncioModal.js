// src/paginas/Anuncios/AddAnuncioModal.js
import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import Modal from '../../componentes/Modal/Modal';
import Button from '../../componentes/Botao/Button';

// Adicionadas props initialData e isEditMode para reutilização
const AddAnuncioModal = ({ isOpen, onClose, onAddAnuncio, initialData, isEditMode }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('item'); // 'item' ou 'servico'
  const [ativo, setAtivo] = useState(true); // Novo estado para o campo "ativo"
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setTitulo(initialData.titulo || '');
      setDescricao(initialData.descricao || '');
      setTipo((initialData.tipoAnuncio || 'ITEM').toLowerCase());
      setAtivo(initialData.ativo !== undefined ? initialData.ativo : true);
    } else if (isOpen && !isEditMode) {
      // Reset para criação
      setTitulo('');
      setDescricao('');
      setTipo('item');
      setAtivo(true);
      setError('');
    }
  }, [isOpen, isEditMode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!titulo.trim() || !descricao.trim()) {
      setError('Por favor, preencha o título e a descrição.');
      return;
    }
    // Passa todos os dados, incluindo 'ativo'
    onAddAnuncio({ titulo, descricao, tipo, ativo }); 
    
    // Limpeza e fechamento são geralmente feitos pelo chamador após o sucesso da API
    // Mas podemos limpar aqui se o modal for fechado independentemente do sucesso
    if (!isEditMode) { // Limpa campos apenas se não estiver editando e o submit for local
        setTitulo('');
        setDescricao('');
        setTipo('item');
        setAtivo(true);
    }
    // onClose(); // O chamador (AnuncioManagementPage ou AnunciosPage) deve chamar onClose após o submit
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Anúncio" : "Adicionar Novo Anúncio de Troca"}>
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
        {/* Campo para Ativo, relevante para admin */}
        {(isEditMode || true) && ( // Sempre mostrar para admin, ou se for modo de edição
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <input
              type="checkbox"
              id="anuncio-ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              style={{ marginRight: '10px', width: 'auto' }}
            />
            <label htmlFor="anuncio-ativo" style={{ marginBottom: '0' }}>Anúncio Ativo</label>
          </div>
        )}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button type="button" onClick={onClose} className="button-secondary" style={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button type="submit">{isEditMode ? "Salvar Alterações" : "Adicionar Anúncio"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAnuncioModal;