import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CrudTabela.css";

const CrudTabela = ({
  titulo,
  get,
  getById,
  deleteById,
  updateById,
  campos_map,
}) => {
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});

  const navigate = useNavigate();

  const carregarDados = async () => {
    try {
      const resultado = await get();
      setDados(resultado);
    } catch (err) {
      setErro("Erro ao carregar dados.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluir = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este item?"
    );
    if (!confirmar) return;

    try {
      await deleteById(id);
      setSucesso("Item excluído com sucesso!");
      setErro("");
      carregarDados();
    } catch (err) {
      setErro("Erro ao excluir item.");
      setSucesso("");
    }
  };

  const handleEditarClick = (item) => {
    setEditandoId(item.id);
    setFormEdicao({ ...item });
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setFormEdicao({});
  };

  const handleInputChange = (campo, valor) => {
    setFormEdicao((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSalvarEdicao = async () => {
    const itemOriginal = dados.find((item) => item.id === editandoId);
    const camposAlterados = {};

    Object.entries(formEdicao).forEach(([campo, valor]) => {
      if (valor !== itemOriginal[campo]) {
        camposAlterados[campo] = valor;
      }
    });

    if (Object.keys(camposAlterados).length === 0) {
      setErro("Nenhuma alteração detectada.");
      return;
    }

    try {
      await updateById(editandoId, camposAlterados);
      setSucesso("Item atualizado com sucesso!");
      setErro("");
      setEditandoId(null);
      carregarDados();
    } catch (err) {
      setErro("Erro ao atualizar item.");
      setSucesso("");
    }
  };
  const irParaCadastro = () => {
  navigate("/cadastro");
};
  return (
    <div className="tabela-container">
      <h2>{titulo}</h2>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
      <button className="botao adicionar" onClick={irParaCadastro}>
        Adicionar Novo
      </button>
      <table className="tabela">
        <thead>
          <tr>
            {Object.keys(campos_map).map((alias) => (
              <th key={alias}>{alias}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              {editandoId === item.id
                ? Object.values(campos_map).map((campo) => (
                    <td key={campo}>
                      <input
                        type="text"
                        value={formEdicao[campo] || ""}
                        onChange={(e) =>
                          handleInputChange(campo, e.target.value)
                        }
                      />
                    </td>
                  ))
                : Object.values(campos_map).map((campo) => (
                    <td key={campo}>{item[campo]}</td>
                  ))}
              <td>
                {editandoId === item.id ? (
                  <>
                    <button className="botao" onClick={handleSalvarEdicao}>
                      Salvar
                    </button>
                    <button
                      className="botao secundario"
                      onClick={handleCancelarEdicao}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="botao"
                      onClick={() => handleEditarClick(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="botao secundario"
                      onClick={() => handleExcluir(item.id)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudTabela;
