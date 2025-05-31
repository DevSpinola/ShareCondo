import Secao from "../../componentes/Secao/Secao";
import Corpo from "../../componentes/Corpo";

const naoEncontrada = () => {
  return (   
    <Corpo>
      <div>
      <Secao
          title="404 - Página não encontrada"
          subtitle="Desculpe, a página que você está procurando não existe ou ainda não foi desenvolvida."
          imageSrc="/imagens/error404.png"
          imageAlt="Erro404"
        />  
      </div> 
    </Corpo>  
  );
};

export default naoEncontrada;
