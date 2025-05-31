// src/paginas/Admin/AddCondoModal.js
import React, { useState, useEffect } from 'react';
import Modal from '../../componentes/Modal/Modal';
import Button from '../../componentes/Botao/Button';
import FormInput from '../../componentes/FormInput';

const AddCondoModal = ({ isOpen, onClose, onAddCondo, onSalvar, initialData, isEditMode }) => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setNome(initialData.nome || '');
      setEndereco(initialData.endereco || '');
    } else if (isOpen && !isEditMode) {
      setNome('');
      setEndereco('');
    }
  }, [isOpen, isEditMode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !endereco.trim()) {
      setError('Nome e Endereço são obrigatórios.');
      return;
    }
    setError('');
    const data = { nome, endereco };
    if (isEditMode) {
      onSalvar(data); // Chama a função de salvar edição do CrudTabela
    } else {
      onAddCondo(data); // Chama a função de adicionar do CondoManagementPage
    }
    // O fechamento do modal e recarregamento dos dados são feitos no CondoManagementPage
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Condomínio" : "Adicionar Novo Condomínio"}>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nome do Condomínio:"
          name="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <FormInput
          label="Endereço:"
          name="endereco"
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button type="button" onClick={onClose} className="button-secondary" style={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button type="submit">{isEditMode ? "Salvar Alterações" : "Adicionar Condomínio"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCondoModal;