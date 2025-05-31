// src/componentes/Admin/UserManagement.js
import React from 'react';
import CrudTabela from '../CrudTabela';
import { getUsuario, getUsuarios, deleteUsuario, updateUsuario } from "../../servicos/usuarios";

const UserManagement = () => {
  const camposMapUsuarios = {
    ID: "id", // Adicionado para visualização, mas geralmente não editável diretamente
    Nome: "nome",
    Email: "email",
    // Senha: "senha", // Geralmente senhas não são exibidas ou editadas diretamente em tabelas
    "Tipo do Usuário": "tipoUsuario",
  };

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      <CrudTabela
        titulo="Usuários Cadastrados"
        campos_map={camposMapUsuarios}
        getById={getUsuario}
        get={getUsuarios}
        deleteById={deleteUsuario}
        updateById={updateUsuario}
        // Você pode adicionar uma prop para um formulário de criação específico se necessário
      />
    </div>
  );
};

export default UserManagement;