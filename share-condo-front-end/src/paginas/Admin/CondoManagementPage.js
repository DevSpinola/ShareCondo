// src/componentes/Admin/CondoManagement.js
import React from 'react';
import CrudTabela from '../../componentes/CrudTabela';

// Placeholder para serviços de condomínio
const getCondominio = async (id) => {
  console.log(`Buscando condomínio com ID: ${id}`);
  // Simula busca de dados
  const mockCondominios = [
    { id: 1, nome: 'Condomínio Paraíso', sindico: 'Ana Paula', blocos: 5, unidades: 100 },
    { id: 2, nome: 'Residencial Bela Vista', sindico: 'Roberto Carlos', blocos: 3, unidades: 60 },
  ];
  return mockCondominios.find(c => c.id === id) || {};
};

const getCondominios = async () => {
  console.log('Buscando todos os condomínios');
   // Simula busca de dados
  return [
    { id: 1, nome: 'Condomínio Paraíso', sindico: 'Ana Paula', blocos: 5, unidades: 100 },
    { id: 2, nome: 'Residencial Bela Vista', sindico: 'Roberto Carlos', blocos: 3, unidades: 60 },
  ];
};

const deleteCondominio = async (id) => {
  console.log(`Excluindo condomínio com ID: ${id}`);
  // Simula exclusão
  return Promise.resolve();
};

const updateCondominio = async (id, dados) => {
  console.log(`Atualizando condomínio com ID: ${id}`, dados);
  // Simula atualização
  return Promise.resolve({ id, ...dados });
};


const CondoManagement = () => {
  const camposMapCondominios = {
    ID: "id",
    Nome: "nome",
    Síndico: "sindico",
    Blocos: "blocos",
    Unidades: "unidades",
  };

  return (
    <div>
      <h2>Gerenciamento de Condomínios</h2>
      <CrudTabela
        titulo="Condomínios Cadastrados"
        campos_map={camposMapCondominios}
        getById={getCondominio}
        get={getCondominios}
        deleteById={deleteCondominio}
        updateById={updateCondominio}
      />
    </div>
  );
};

export default CondoManagement;