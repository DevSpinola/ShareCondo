// src/paginas/Admin/OfertaManagementPage.js
import React, { useState, useEffect } from 'react';
import { getOfertasPorAnuncio, getOfertasPorUsuario } from '../../servicos/ofertas'; // getOfertaById removido se não houver ação de "ver detalhes"

const OfertaManagementPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('anuncio');
  const [filtroId, setFiltroId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const camposMapOfertas = {
    ID: "id",
    "ID Anúncio": "anuncioId",
    Ofertante: "ofertante.nome", 
    Tipo: "tipoOferta",
    Valor: "valor",
    Descrição: "descricao",
    Data: "dataOferta",
    Status: "status",
  };
  
  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
  };

  const handleBuscarOfertas = async () => {
    if (!filtroId.trim()) {
      setError('Por favor, insira um ID para filtrar.');
      setOfertas([]);
      return;
    }
    setLoading(true);
    setError('');
    setOfertas([]);
    try {
      let data;
      if (filtroTipo === 'anuncio') {
        data = await getOfertasPorAnuncio(filtroId);
      } else {
        data = await getOfertasPorUsuario(filtroId);
      }
      setOfertas(data || []);
    } catch (err) {
      console.error(`Erro ao buscar ofertas por ${filtroTipo}:`, err);
      const errorMsg = err.response?.data?.message || err.response?.data || `Falha ao carregar ofertas. Verifique o ID e tente novamente.`;
      setError(errorMsg);
      setOfertas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tabela-container">
      <h2>Gerenciamento de Ofertas</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ padding: '8px' }}>
          <option value="anuncio">Por ID do Anúncio</option>
          <option value="usuario">Por ID do Usuário Ofertante</option>
        </select>
        <input
          type="text"
          placeholder={`ID do ${filtroTipo === 'anuncio' ? 'Anúncio' : 'Usuário'}`}
          value={filtroId}
          onChange={(e) => setFiltroId(e.target.value)}
          style={{ padding: '8px', flexGrow: 1 }}
        />
        <button onClick={handleBuscarOfertas} className="botao" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Ofertas'}
        </button>
      </div>

      {error && <p className="mensagem-erro">{error}</p>}
      
      {loading && <p>Carregando ofertas...</p>}

      {!loading && ofertas.length === 0 && !error && filtroId && <p>Nenhuma oferta encontrada para o filtro aplicado.</p>}
      {!loading && ofertas.length === 0 && !error && !filtroId && <p>Insira um ID e clique em buscar para ver as ofertas.</p>}


      {ofertas.length > 0 && (
        <table className="tabela">
          <thead>
            <tr>
              {Object.keys(camposMapOfertas).map((alias) => (
                <th key={alias}>{alias}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ofertas.map((oferta) => (
              <tr key={oferta.id}>
                <td>{oferta.id}</td>
                <td>{oferta.anuncioId}</td>
                <td>{oferta.ofertante?.nome || oferta.ofertante?.email || 'N/A'}</td>
                <td>{oferta.tipoOferta}</td>
                <td>{oferta.tipoOferta === 'DINHEIRO' && oferta.valor !== null ? `R$ ${Number(oferta.valor).toFixed(2)}` : 'N/A'}</td>
                <td>{oferta.descricao || 'N/A'}</td>
                <td>{formatarData(oferta.dataOferta)}</td>
                <td>{oferta.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OfertaManagementPage;