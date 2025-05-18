import React, { useState } from "react";
//import CrudTabela from "./CrudTabela";

const ConsoleAdmin = ({ cruds }) => {
  const [aberto, setAberto] = useState(null);

  const toggleAba = (index) => {
    setAberto(aberto === index ? null : index);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Console</h1>
      {cruds.map((crud, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <div
            onClick={() => toggleAba(index)}
            style={{
              cursor: "pointer",
              backgroundColor: "#eee",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold"
            }}
          >
            {crud.titulo}
          </div>
          {aberto === index && (
            <h1>Aqui tera a tabela</h1>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsoleAdmin;
