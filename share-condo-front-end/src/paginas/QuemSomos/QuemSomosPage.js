// src/paginas/QuemSomos/QuemSomosPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Corpo from '../../componentes/Corpo'; // Se quiser usar o container Corpo
import Button from '../../componentes/Botao/Button';
import './QuemSomosPage.css';

const QuemSomosPage = () => {
  return (
    // <Corpo> // Opcional: Se quiser a centralização padrão do Corpo
      <div className="quem-somos-container">
        <header className="quem-somos-header">
          <h1>Sobre o ShareCondo</h1>
          <p className="subtitle">Conectando vizinhos, fortalecendo comunidades.</p>
        </header>

        <section className="quem-somos-section historia">
          <h2>Nossa História</h2>
          <p>
            O ShareCondo nasceu de uma ideia simples, mas poderosa: e se pudéssemos usar a tecnologia para 
            resgatar e fortalecer o espírito de vizinhança que muitas vezes se perde na correria do dia a dia?
            Percebemos que, mesmo morando tão perto uns dos outros, raramente conhecemos as habilidades, 
            necessidades e gentilezas que nossos vizinhos têm a oferecer.
          </p>
          <p>
            Assim, em 2025, um grupo de entusiastas da tecnologia e da vida em comunidade
            uniu forças para criar uma plataforma que facilitasse essas conexões. Queríamos um espaço onde
            a troca de um item esquecido, a ajuda para um pequeno reparo ou o compartilhamento de um hobby
            pudessem acontecer de forma simples, segura e, acima de tudo, amigável.
          </p>
        </section>

        <section className="quem-somos-section missao-visao">
          <h2>Nossa Missão e Visão</h2>
          <p><strong>Missão:</strong> Conectar vizinhos, promover um estilo de vida mais colaborativo, econômico e sustentável dentro dos condomínios, fortalecendo os laços comunitários através da troca de itens, serviços e gentilezas.</p>
          <p><strong>Visão:</strong> Ser a plataforma de referência para a construção de comunidades condominiais mais unidas, participativas e solidárias em todo o Brasil, transformando cada condomínio em uma vibrante rede de apoio mútuo.</p>
        </section>

        <section className="quem-somos-section valores">
          <h2>Nossos Valores</h2>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="icon">🤝</div> {/* Use ícones reais ou emojis */}
              <h3>Colaboração</h3>
              <p>Acreditamos no poder da cooperação para resolver problemas e criar oportunidades.</p>
            </div>
            <div className="valor-card">
              <div className="icon">🛡️</div>
              <h3>Confiança</h3>
              <p>Construímos um ambiente seguro onde os vizinhos podem interagir com tranquilidade.</p>
            </div>
            <div className="valor-card">
              <div className="icon">🏘️</div>
              <h3>Comunidade</h3>
              <p>Fortalecemos os laços locais, transformando vizinhos em amigos.</p>
            </div>
            <div className="valor-card">
              <div className="icon">♻️</div>
              <h3>Sustentabilidade</h3>
              <p>Promovemos o reuso e o compartilhamento, reduzindo o desperdício e o consumo.</p>
            </div>
            <div className="valor-card">
              <div className="icon">💡</div>
              <h3>Inovação</h3>
              <p>Buscamos constantemente novas formas de facilitar e enriquecer a vida em condomínio.</p>
            </div>
            <div className="valor-card">
              <div className="icon">😊</div>
              <h3>Gentileza</h3>
              <p>Incentivamos a cordialidade e o respeito mútuo em todas as interações.</p>
            </div>
          </div>
        </section>

        <section className="quem-somos-section o-que-fazemos">
          <h2>O Que Você Pode Fazer no ShareCondo?</h2>
          <ul>
            <li>Oferecer itens que não utiliza mais, mas que podem ser úteis para um vizinho.</li>
            <li>Pedir emprestado aquela ferramenta que você só precisa usar uma vez.</li>
            <li>Compartilhar suas habilidades, desde consertar algo até dar aulas particulares.</li>
            <li>Encontrar ajuda para cuidar do seu pet durante uma viagem ou para pequenas tarefas domésticas.</li>
            <li>Propor trocas de serviços: "Eu te ajudo com seu jardim, você me ajuda com meu computador?"</li>
            <li>Descobrir talentos e interesses em comum com as pessoas que moram ao seu lado.</li>
          </ul>
        </section>

        <section className="quem-somos-section team-section">
          <h2>Nossa Equipe</h2>
          <p>
            Somos um time apaixonado por tecnologia e pelo poder das conexões humanas. Trabalhamos todos os dias
            para tornar o ShareCondo uma ferramenta cada vez melhor para você e seu condomínio.
          </p>
          {/* Você pode adicionar uma imagem genérica de equipe ou da comunidade aqui */}
          <img src="/imagens/equipe-sharecondo.jpg" alt="Equipe ShareCondo ou Comunidade Feliz" />
          {/* Certifique-se de ter uma imagem em public/imagens/equipe-sharecondo.jpg ou use um placeholder */}
        </section>

        <section className="call-to-action">
          <h2>Pronto para transformar seu condomínio?</h2>
          <p>Junte-se à comunidade ShareCondo e comece a compartilhar hoje mesmo!</p>
          <Link to="/cadastro">
            <Button className="custom-button">Cadastre-se Agora</Button>
          </Link>
        </section>
      </div>
    // </Corpo> // Fechamento do Corpo opcional
  );
};

export default QuemSomosPage;