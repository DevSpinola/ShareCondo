import Secao from "../../componentes/Secao/Secao";
import Corpo from "../../componentes/Corpo";

function Home() {
  return (
    <Corpo>
      <Secao
        title="Unindo vizinhos, promovendo conexões"
        subtitle="Com o ShareCondo, o seu condomínio se transforma em uma rede de colaboração. Compartilhe serviços, ajude quem está perto e economize tempo e dinheiro enquanto fortalece os laços com sua vizinhança."
        imageSrc="/imagens/section1-img.png"
        imageAlt="Comunidade unida"
      />
      <Secao
        title="Transforme necessidades em oportunidades dentro do seu condomínio"
        subtitle="Precisa de uma furadeira, uma babá, ou alguém para cuidar do pet no fim de semana? Com o ShareCondo, você pode oferecer e solicitar serviços de forma rápida, segura e colaborativa — tudo isso com seus próprios vizinhos."
        imageSrc="/imagens/section2-img.png"
        imageAlt="Comunidade solidária"
        reverse={true}
      />
    </Corpo>
  );
}

export default Home;
