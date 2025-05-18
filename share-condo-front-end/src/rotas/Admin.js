import Secao from "../componentes/Secao";
import Corpo from "../componentes/Corpo";
import { Link } from "react-router-dom";
import ConsoleAdmin from "../componentes/ConsoleAdmin";
import { getUsuario, getUsuarios, deleteUsuario, updateUsuario } from "../servicos/usuarios";
import CrudTabela from "../componentes/CrudTabela";

function Admin() {
  return (
    <Corpo>
      <CrudTabela
        titulo="Usuários"
        campos_map={{
          Nome: "nome",
          Email: "email",
          Senha: "senha",
          "Tipo do Usuário": "tipoUsuario",
        }}
        getById={getUsuario}
        get={getUsuarios}
        deleteById={deleteUsuario}
        updateById= {updateUsuario}
      />
      {/* <Secao
        title="Área do Administrador"
        subtitle="Bem-vindo à área do administrador. Aqui você pode gerenciar os cadastros."
        imageSrc="/imagens/admin.png"
        imageAlt="Administração"
      />
      <Link to="/"></Link> */}
    </Corpo>
  );
}

export default Admin;
