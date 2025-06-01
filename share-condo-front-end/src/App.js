// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import HomePage from './paginas/Home/HomePage';
import LoginPage from "./paginas/Login/LoginPage";
import CadastroPage from "./paginas/Cadastro/CadastroPage";
import AnunciosPage from './paginas/Anuncios/AnunciosPage';
import MeusAnunciosPage from './paginas/MeusAnuncios/MeusAnunciosPage';
import MinhasOfertasPage from './paginas/MinhasOfertas/MinhasOfertasPage';
import NotFoundPage from "./paginas/NotFound/NotFoundPage";
import AnuncioDetalhePage from './paginas/AnuncioDetalhe/AnuncioDetalhePage'; // <-- ADICIONAR IMPORTAÇÃO

// Páginas de Admin
// ... (imports de admin)

// Componentes de Layout
import Cabecalho from "./componentes/Cabecalho";
import Rodape from "./componentes/Rodape/Rodape";
import Corpo from './componentes/Corpo';
import AdminLayout from './paginas/Admin/AdminLayout';

function App() {
  return (
    <Router>
      <Cabecalho login_link="/login" register_link="/cadastro" />
      <Corpo>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quem-somos" element={<NotFoundPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            {/* ... (rotas de admin) ... */}
          </Route>

          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/anuncios/:id" element={<AnuncioDetalhePage />} /> {/* <-- ADICIONAR NOVA ROTA */}
          <Route path="/meus-anuncios" element={<MeusAnunciosPage />} />
          <Route path="/minhas-ofertas" element={<MinhasOfertasPage />} />
          
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Corpo>
      <Rodape fb_link="/facebook" ig_link="/instagram" tw_link="/twitter" />
    </Router>
  );
}

export default App;