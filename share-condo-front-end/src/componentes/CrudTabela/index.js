// src/componentes/CrudTabela/index.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ainda pode ser útil para outras ações no futuro
import "./CrudTabela.css";

const CrudTabela = ({
  titulo,
  get,
  getById,
  deleteById,
  updateById,
  createFunction, // Nova prop para a função de criar/abrir modal de criação
  campos_map,
  editModalComponent: EditModalComponent, // Componente modal para edição
  createModalComponent: CreateModalComponent, // Componente modal para criação
  refreshData, // Função para recarregar os dados da tabela
}) => {
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [editandoItem, setEditandoItem] = useState(null); // Para controlar o item em edição no modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate(); // Mantido para flexibilidade futura

  const carregarDados = async () => {
    setErro("");
    try {
      const resultado = await get();
      setDados(Array.isArray(resultado) ? resultado : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setErro("Erro ao carregar dados: " + (err.response?.data?.message || err.message));
      setDados([]);
    }
  };

  useEffect(() => {
    carregarDados();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get, refreshData]); // Adicionado refreshData como dependência

  const handleExcluir = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este item?"
    );
    if (!confirmar) return;

    try {
      await deleteById(id);
      setSucesso("Item excluído com sucesso!");
      setErro("");
      carregarDados(); // Recarrega os dados
    } catch (err) {
      console.error("Erro ao excluir item:", err);
      setErro("Erro ao excluir item: " + (err.response?.data?.message || err.message));
      setSucesso("");
    }
  };

  const handleAbrirModalEdicao = async (id) => {
    try {
      const itemParaEditar = await getById(id);
      setEditandoItem(itemParaEditar);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Erro ao buscar item para edição:", err);
      setErro("Erro ao buscar item para edição: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSalvarEdicao = async (dadosEditados) => {
    if (!editandoItem || !editandoItem.id) {
      setErro("Nenhum item selecionado para edição.");
      return;
    }
    try {
      await updateById(editandoItem.id, dadosEditados);
      setSucesso("Item atualizado com sucesso!");
      setErro("");
      setIsEditModalOpen(false);
      setEditandoItem(null);
      carregarDados(); // Recarrega os dados
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      setErro("Erro ao atualizar item: " + (err.response?.data?.message || err.message));
      setSucesso("");
    }
  };

  const handleAbrirModalCriacao = () => {
    if (CreateModalComponent) {
      setIsCreateModalOpen(true);
    } else if (typeof createFunction === 'function') {
      createFunction(); // Para casos onde o modal é gerenciado externamente ou é uma navegação
    } else {
      console.warn("Nenhuma função de criação ou modal de criação fornecido para CrudTabela.");
    }
  };

  const handleSalvarCriacao = async (novosDados) => {
     // A lógica de chamada ao `createFunction` (API) deve estar dentro do `CreateModalComponent`
     // ou ser passada para ele. O CrudTabela só precisa saber recarregar os dados.
    try {
        // Assumindo que a função createFunction (se passada diretamente) ou a lógica
        // dentro do CreateModalComponent já lidou com a chamada da API.
        // Se o createFunction aqui for a chamada direta da API:
      if (typeof createFunction === 'function' && !CreateModalComponent) { // Evitar se CreateModalComponent já lida
        await createFunction(novosDados);
      }
      setSucesso("Item adicionado com sucesso!");
      setErro("");
      setIsCreateModalOpen(false);
      carregarDados(); // Recarrega os dados
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      setErro("Erro ao adicionar item: " + (err.response?.data?.message || err.message));
      setSucesso("");
    }
  };


  // Prepara os cabeçalhos da tabela a partir do campos_map
  const headers = Object.keys(campos_map);
  // Prepara os campos de dados a serem extraídos de cada item
  const dataFields = Object.values(campos_map);

  const renderFieldValue = (item, fieldPath) => {
    let value;
    if (fieldPath.includes('.')) {
      const parts = fieldPath.split('.');
      value = item;
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part];
        } else {
          return 'N/A'; // Ou algum placeholder
        }
      }
    } else {
      value = item[fieldPath];
    }

    // Adiciona tratamento para valores booleanos
    if (typeof value === 'boolean') {
      // Você pode mudar para "Ativo"/"Inativo" ou "1"/"0" se preferir
      return value ? 'Sim' : 'Não'; 
    }

    // Formatação específica para datas (lógica existente)
    if (typeof value === 'string' && (fieldPath.toLowerCase().includes('data') || fieldPath.toLowerCase().includes('date'))) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + date.toLocaleTimeString('pt-BR');
        }
    }
    
    // Para outros tipos de valores, ou se for null/undefined, retorna como está (ou um placeholder)
    // Se 'value' for null ou undefined, pode aparecer em branco. Pode-se adicionar um placeholder aqui também se desejado.
    // Ex: if (value === null || value === undefined) return 'N/D';
    return value;
  };


  return (
    <div className="tabela-container">
      {titulo && <h2>{titulo}</h2>}

      {erro && <p className="mensagem-erro">{erro}</p>}
      {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
      
      {(CreateModalComponent || typeof createFunction === 'function') && (
        <button className="botao adicionar" onClick={handleAbrirModalCriacao}>
          Adicionar Novo
        </button>
      )}

      <table className="tabela">
        <thead>
          <tr>
            {headers.map((alias) => (
              <th key={alias}>{alias}</th>
            ))}
            {(EditModalComponent || deleteById) && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              {dataFields.map((field) => (
                <td key={`${item.id}-${field}`}>{renderFieldValue(item, field)}</td>
              ))}
              {(EditModalComponent || deleteById) && (
                <td>
                  {EditModalComponent && (
                    <button
                      className="botao"
                      onClick={() => handleAbrirModalEdicao(item.id)}
                    >
                      Editar
                    </button>
                  )}
                  {deleteById && (
                    <button
                      className="botao secundario"
                      onClick={() => handleExcluir(item.id)}
                    >
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {EditModalComponent && editandoItem && (
        <EditModalComponent
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditandoItem(null);
          }}
          itemParaEditar={editandoItem}
          onSalvar={handleSalvarEdicao} // A lógica de chamar updateById estará no modal ou será passada como prop
        />
      )}

      {CreateModalComponent && (
        <CreateModalComponent
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSalvar={handleSalvarCriacao} // A lógica de chamar a API de criação estará no modal
        />
      )}
    </div>
  );
};

export default CrudTabela;