// src/paginas/Admin/CondoManagementPage.js
import React, { useState, useCallback } from 'react';
import CrudTabela from '../../componentes/CrudTabela';
import AddCondoModal from './AddCondoModal'; // Modal para adicionar/editar
import { getCondominioById, getCondominios, deleteCondominio, updateCondominio, createCondominio } from '../../servicos/condominios';

const CondoManagementPage = () => {
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar a atualização do CrudTabela

  const camposMapCondominios = {
    ID: "id",
    Nome: "nome",
    Endereço: "endereco",
  };
  
  const handleDataChange = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);


  // EditModal específico para Condomínios (pode ser o mesmo AddCondoModal com lógica de edição)
  // Para este exemplo, vamos assumir que AddCondoModal pode lidar com edição se passarmos `itemParaEditar`
  const EditCondoModal = ({ isOpen, onClose, itemParaEditar, onSalvar }) => {
    // Se AddCondoModal não lida com edição, você precisaria de um EditCondoModal.
    // Por simplicidade, reutilizaremos AddCondoModal, adaptando-o ou assumindo que ele pode receber 'initialData'
    return (
      <AddCondoModal
        isOpen={isOpen}
        onClose={onClose}
        onAddCondo={onSalvar} // onSalvar do CrudTabela chamará updateById
        initialData={itemParaEditar} // Passando dados para preencher o formulário para edição
        isEditMode={!!itemParaEditar} // Para o modal saber se está em modo de edição
      />
    );
  };


  return (
    <div>
      <h2>Gerenciamento de Condomínios</h2>
      <CrudTabela
        titulo="Condomínios Cadastrados"
        campos_map={camposMapCondominios}
        getById={getCondominioById}
        get={getCondominios}
        deleteById={deleteCondominio}
        updateById={updateCondominio} // Usado por EditCondoModal
        createFunction={createCondominio} // Usado por AddCondoModal (via prop onSalvar)
        createModalComponent={(props) => (
          <AddCondoModal
            {...props}
            onAddCondo={async (data) => {
              await createCondominio(data);
              handleDataChange(); // Recarrega os dados da tabela
              props.onClose(); // Fecha o modal
            }}
          />
        )}
        editModalComponent={(props) => (
            <EditCondoModal
             {...props}
             onSalvar={async (data) => { // onSalvar aqui é o que o CrudTabela chama
                await updateCondominio(props.itemParaEditar.id, data);
                handleDataChange();
                props.onClose();
             }}
            />
        )}
        refreshData={refreshKey} // Passa a chave para CrudTabela observar mudanças
      />
    </div>
  );
};

export default CondoManagementPage;