// src/paginas/Home/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Secao from "../../componentes/Secao/Secao";
// import Corpo from "../../componentes/Corpo"; // Removido se HomePage.css controlar o layout
import Button from '../../componentes/Botao/Button';
import { getUsuarioLogado } from '../../servicos/auth';
import './HomePage.css'; // Certifique-se que este CSS existe e está adequado

function Home() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    setUsuarioLogado(getUsuarioLogado());
  }, []);

  return (
    <div className="homepage-container">
      {/* Hero Section - Simplificada sem imagem de fundo específica no JS, pode ser feita via CSS se desejar */}
      <section className="hero-section">
        <h1>Bem-vindo ao ShareCondo!</h1>
        <p className="hero-subtitle">
          A plataforma que transforma seu condomínio em uma comunidade mais unida, colaborativa e sustentável.
          Compartilhe, troque, ajude e conecte-se com seus vizinhos como nunca antes.
        </p>
        <div className="hero-cta-buttons">
          {usuarioLogado && usuarioLogado.statusUsuario === 'APROVADO' ? (
            <Link to="/anuncios">
              <Button className="button-primary">Ver Anúncios</Button>
            </Link>
          ) : (
            <Link to="/cadastro">
              <Button className="button-primary">Cadastre-se Gratuitamente</Button>
            </Link>
          )}
          <Link to="/quem-somos">
            <Button className="button-secondary">Saiba Mais</Button>
          </Link>
        </div>
      </section>

      {/* Como Funciona Section - Texto apenas */}
      <section className="como-funciona-section">
        <h2>Como Funciona? É Simples!</h2>
        <div className="passos-grid">
          <div className="passo-card">
            <div className="passo-numero">1</div>
            <h3>Cadastre-se</h3>
            <p>Crie sua conta gratuitamente e associe-se ao seu condomínio. É rápido e fácil!</p>
          </div>
          <div className="passo-card">
            <div className="passo-numero">2</div>
            <h3>Publique ou Procure</h3>
            <p>Anuncie itens que não usa mais, ofereça serviços ou procure por algo que precisa.</p>
          </div>
          <div className="passo-card">
            <div className="passo-numero">3</div>
            <h3>Conecte-se e Troque</h3>
            <p>Converse com seus vizinhos, combine trocas, empréstimos ou serviços de forma segura.</p>
          </div>
        </div>
      </section>

      {/* Seções Originais (mantidas) */}
      <Secao
        className="home-secao"
        title="Unindo vizinhos, fortalecendo conexões"
        subtitle="Com o ShareCondo, seu condomínio se transforma em uma rede de colaboração. Compartilhe serviços, ajude quem está perto e economize tempo e dinheiro enquanto fortalece os laços com sua vizinhança."
        imageSrc="/imagens/section1-img.png" // Imagem existente
        imageAlt="Comunidade unida e colaborativa"
      />
      
      <Secao
        className="home-secao"
        title="Transforme necessidades em oportunidades"
        subtitle="Precisa de uma furadeira, uma babá por algumas horas, ou alguém para cuidar do seu pet no fim de semana? No ShareCondo, você encontra e oferece ajuda de forma rápida e segura — tudo entre vizinhos!"
        imageSrc="/imagens/section2-img.png" // Imagem existente
        imageAlt="Vizinhos trocando favores e itens"
        reverse={true}
      />

      {/* Benefícios Section - Texto apenas */}
      <section className="beneficios-section">
        <h2>Principais Benefícios</h2>
        <div className="passos-grid"> {/* Reutilizando a classe .passos-grid */}
          <div className="beneficio-card">
            {/* Removida tag <img> para ícone */}
            <h3>Economia Inteligente</h3>
            <p>Reduza gastos pegando emprestado ou trocando itens e serviços em vez de comprar novos.</p>
          </div>
          <div className="beneficio-card">
            {/* Removida tag <img> para ícone */}
            <h3>Comunidade Forte</h3>
            <p>Conheça seus vizinhos, crie laços de amizade e confiança, e fortaleça o espírito comunitário.</p>
          </div>
          <div className="beneficio-card">
            {/* Removida tag <img> para ícone */}
            <h3>Vida Sustentável</h3>
            <p>Promova o reuso, evite o desperdício e contribua para um consumo mais consciente e ecológico.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="final-cta-section">
        <h2>Faça Parte da Mudança no Seu Condomínio!</h2>
        <p>
          Descubra um novo jeito de viver em comunidade, onde a colaboração e a gentileza fazem a diferença no dia a dia.
        </p>
        {usuarioLogado && usuarioLogado.statusUsuario === 'APROVADO' ? (
             <Link to="/anuncios">
                <Button>Explorar Anúncios</Button>
            </Link>
        ) : (
            <Link to="/cadastro">
                <Button>Quero Fazer Parte!</Button>
            </Link>
        )}
      </section>
    </div>
  );
}

export default Home;