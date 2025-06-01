// src/paginas/Cadastro/CadastroPage.js
import React, { useState, useEffect } from "react";
import Formulario from "../../componentes/Formulario";
import Corpo from "../../componentes/Corpo";
import { cadastro } from "../../servicos/auth"; // login removido se não for fazer login automático aqui
import { getCondominios } from "../../servicos/condominios";

const camposCadastroBase = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "nome", label: "Nome Completo", type: "text", required: true },
  { name: "senha", label: "Senha", type: "password", required: true },
  {
    name: "confirmarSenha",
    label: "Confirmar Senha",
    type: "password",
    required: true,
  },
];

const CadastroPage = () => {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [condominiosOptions, setCondominiosOptions] = useState([]);
  // Para simplificar, vamos assumir que o tipoUsuario é sempre "USUARIO" no cadastro público.
  // O tipo SINDICO seria atribuído por um ADMIN.
  // Se quiser permitir auto-solicitação de SINDICO, descomente e ajuste a lógica.
  // const [tipoUsuarioSelecionado, setTipoUsuarioSelecionado] = useState("USUARIO"); 
  const [camposFormulario, setCamposFormulario] = useState(camposCadastroBase);
  const [isLoadingCondominios, setIsLoadingCondominios] = useState(true);


  useEffect(() => {
    async function carregarCondominios() {
      setIsLoadingCondominios(true);
      try {
        const data = await getCondominios(); // Servico retorna List<CondominioDTO>
        if (Array.isArray(data)) {
          setCondominiosOptions(data.map(c => ({ value: c.id, label: `${c.nome} - ${c.endereco}` })));
        } else {
          setCondominiosOptions([]);
          console.error("Resposta de condomínios não é um array:", data);
          setErro("Não foi possível carregar a lista de condomínios (formato inválido).");
        }
      } catch (error) {
        console.error("Erro ao carregar condomínios:", error);
        setErro("Falha ao carregar a lista de condomínios. Tente novamente mais tarde.");
        setCondominiosOptions([]);
      } finally {
        setIsLoadingCondominios(false);
      }
    }
    carregarCondominios();
  }, []);

  useEffect(() => {
    let novosCampos = [...camposCadastroBase];
    const tipoUsuarioAtual = "USUARIO"; // Fixo para cadastro público

    if (tipoUsuarioAtual === "USUARIO" && !isLoadingCondominios) {
      if (condominiosOptions.length > 0) {
        novosCampos.push({
          name: "condominioId",
          label: "Selecione seu Condomínio*",
          type: "select",
          options: [{ value: "", label: "Selecione..." }, ...condominiosOptions],
          required: true,
        });
      } else {
         novosCampos.push({
            name: "condominioIdInfo",
            label: "Condomínio",
            type: "info", // Um tipo customizado para seu Formulario, ou apenas um <p>
            text: erro || "Carregando lista de condomínios ou nenhum disponível..."
         });
      }
    }
    setCamposFormulario(novosCampos);
  }, [condominiosOptions, isLoadingCondominios, erro]);


  const handleCadastro = async (dados) => {
    setErro("");
    setSucesso("");
    if (dados.senha !== dados.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    const tipoUsuarioParaEnviar = "USUARIO"; // Fixo para cadastro público

    if (tipoUsuarioParaEnviar === "USUARIO" && (!dados.condominioId || dados.condominioId === "")) {
        setErro("Por favor, selecione um condomínio.");
        return;
    }

    try {
      await cadastro(dados.email, dados.nome, dados.senha, tipoUsuarioParaEnviar, dados.condominioId);
      setSucesso("Cadastro realizado com sucesso! Sua conta passará por aprovação do síndico do condomínio. Você será notificado.");
      setErro("");
      // Não fazer login automático, pois a conta está pendente
      // setTimeout(() => {
      //   window.location.href = "/login";
      // }, 4000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Erro ao cadastrar. Tente novamente.";
      setErro(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <Corpo>
      <Formulario
        campos={camposFormulario}
        onSubmit={handleCadastro}
        titulo="Cadastro de Morador"
        botaoTexto="Cadastrar"
        erro={erro}
        sucesso={sucesso}
      />
       {sucesso && <p style={{ textAlign: 'center', marginTop: '20px', color: 'green' }}>{sucesso}</p>}
    </Corpo>
  );
};

export default CadastroPage;