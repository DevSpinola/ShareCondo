// src/paginas/Admin/UserManagementPage.js
import React, { useState, useEffect, useCallback } from 'react';
import CrudTabela from '../../componentes/CrudTabela';
import { getUsuario, getUsuarios, deleteUsuario, updateUsuario } from "../../servicos/usuarios";
import EditUserModal from './EditUserModal'; // Modal para edição
import { getCondominios } from '../../servicos/condominios'; // Para popular o select no modal

const UserManagementPage = () => {
    const [condominios, setCondominios] = useState([]);
    const [loadingCondominios, setLoadingCondominios] = useState(true);
    const [errorCondominios, setErrorCondominios] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Para forçar atualização do CrudTabela

    // Definindo o mapeamento das colunas para o CrudTabela
    const camposMapUsuarios = {
        ID: "id",
        Nome: "nome",
        Email: "email",
        Tipo: "tipoUsuario",
        Status: "statusUsuario", // Nova Coluna
        Condomínio: "condominioNome" // Nova Coluna (vem do UsuarioDTO)
        // A renderização de "condominioNome" como N/A se null será tratada dentro do CrudTabela
        // ou o UsuarioDTO já garante uma string.
    };

    const handleDataChange = useCallback(() => {
        setRefreshKey(prevKey => prevKey + 1);
    }, []);

    useEffect(() => {
        async function carregarCondominios() {
            setLoadingCondominios(true);
            try {
                const dataCondominios = await getCondominios();
                setCondominios(dataCondominios || []);
                setErrorCondominios(null);
            } catch (err) {
                console.error("Erro ao carregar condomínios:", err);
                setErrorCondominios("Falha ao carregar lista de condomínios.");
                setCondominios([]);
            } finally {
                setLoadingCondominios(false);
            }
        }
        carregarCondominios();
    }, []);

    // Função para criar o componente EditUserModal com as props necessárias
    // O CrudTabela chamará esta função passando suas próprias props (isOpen, onClose, itemParaEditar, onSalvar)
    const renderEditUserModal = (crudTabelaProps) => {
        // Extrai itemParaEditar e o restante das props
        const { itemParaEditar, ...restCrudTabelaProps } = crudTabelaProps;
        
        // Log para confirmar os dados que estão sendo mapeados
        console.log('[UserManagementPage] Mapeando itemParaEditar para usuarioExistente:', itemParaEditar);

        return (
            <EditUserModal
                {...restCrudTabelaProps} // Passa props como isOpen, onClose, onSave
                usuarioExistente={itemParaEditar} // Mapeia explicitamente para a prop esperada pelo EditUserModal
                condominiosDisponiveis={condominios}
                onSuccess={handleDataChange}
            />
        );
    };
    
    if (loadingCondominios) {
        return <p>Carregando dados auxiliares...</p>;
    }
    if (errorCondominios) {
        return <p style={{color: 'red'}}>{errorCondominios}</p>
    }

    return (
        <div>
            <h2>Gerenciamento de Usuários</h2>
            {/* Feedback de operações (salvar, excluir) será tratado dentro do CrudTabela
                ou pode ser elevado se o CrudTabela fornecer callbacks para isso */}
            <CrudTabela
                titulo="Usuários Cadastrados"
                campos_map={camposMapUsuarios}
                get={getUsuarios}         // CrudTabela buscará os dados
                getById={getUsuario}      // CrudTabela buscará o item para editar
                deleteById={deleteUsuario}  // CrudTabela chamará esta função para deletar
                updateById={updateUsuario}  // CrudTabela (via EditModal) chamará para atualizar
                editModalComponent={renderEditUserModal} // Passa a função que renderiza o modal
                refreshData={refreshKey} // Para o CrudTabela se atualizar quando esta chave mudar
                // createFunction e createModalComponent podem ser adicionados se houver um fluxo de criação de usuário aqui
            />
        </div>
    );
};

export default UserManagementPage;