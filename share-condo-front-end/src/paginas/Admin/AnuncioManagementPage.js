// src/paginas/Admin/AnuncioManagementPage.js
import React, { useState, useCallback } from 'react';
import CrudTabela from '../../componentes/CrudTabela';
import AddAnuncioModal from '../Anuncios/AddAnuncioModal'; // Reutilizando o modal existente
import { getAnuncios, getAnuncioById, deleteAnuncio, updateAnuncio, createAnuncio } from '../../servicos/anuncios';

const AnuncioManagementPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const camposMapAnuncios = {
    ID: "id",
    Título: "titulo",
    Descrição: "descricao",
    Tipo: "tipoAnuncio",
    Anunciante: "anunciante.nome",
    Criação: "dataCriacao",
    Ativo: "ativo",
  };
  
  const handleDataChange = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  // Componente Modal para Edição de Anúncio
  // Poderia ser um modal separado ou adaptar o AddAnuncioModal
  const EditAnuncioModal = ({ isOpen, onClose, itemParaEditar, onSalvar }) => {
    // Adaptação do AddAnuncioModal para edição
    const handleEditSubmit = async (dadosEditados) => {
      // O payload para updateAnuncio pode precisar ser ajustado
      const payload = {
        titulo: dadosEditados.titulo,
        descricao: dadosEditados.descricao,
        tipoAnuncio: dadosEditados.tipo.toUpperCase(), // Garante que o enum seja enviado corretamente
        ativo: dadosEditados.ativo !== undefined ? dadosEditados.ativo : itemParaEditar.ativo
      };
      onSalvar(payload); // onSalvar do CrudTabela chamará updateById
    };

    return (
      <AddAnuncioModal
        isOpen={isOpen}
        onClose={onClose}
        onAddAnuncio={handleEditSubmit} // Reutilizando a prop onAddAnuncio para a lógica de submit
        initialData={itemParaEditar} // Passando dados para preencher
        isEditMode={true} // Indicando modo de edição
        // O AddAnuncioModal precisaria ser adaptado para receber initialData e isEditMode
        // e mudar seu título e texto do botão de acordo.
        // Ou criar um EditAnuncioModal dedicado.
      />
    );
  };
  
  // Adaptação do AddAnuncioModal para Admin
  const AdminAddAnuncioModal = ({ isOpen, onClose, onSalvar }) => {
      const handleCreateSubmit = async (dadosNovoAnuncio) => {
          const payload = {
              titulo: dadosNovoAnuncio.titulo,
              descricao: dadosNovoAnuncio.descricao,
              tipoAnuncio: dadosNovoAnuncio.tipo.toUpperCase(),
              ativo: dadosNovoAnuncio.ativo !== undefined ? dadosNovoAnuncio.ativo : true
          };
          await createAnuncio(payload); // Chama a API diretamente
          handleDataChange(); // Recarrega
          onClose(); // Fecha
      };

      return (
        <AddAnuncioModal
            isOpen={isOpen}
            onClose={onClose}
            onAddAnuncio={handleCreateSubmit} // onAddAnuncio agora chama a API e atualiza
            isEditMode={false}
        />
      );
  };


  return (
    <div>
      <h2>Gerenciamento de Anúncios</h2>
      <CrudTabela
        titulo="Anúncios Cadastrados"
        campos_map={camposMapAnuncios}
        getById={getAnuncioById}
        get={getAnuncios}
        deleteById={deleteAnuncio}
        updateById={updateAnuncio} // Usado pelo EditAnuncioModal
        createModalComponent={AdminAddAnuncioModal} // Passa o componente modal de criação
        editModalComponent={EditAnuncioModal} // Passa o componente modal de edição
        refreshData={refreshKey}
      />
    </div>
  );
};

export default AnuncioManagementPage;