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
import AnuncioDetalhePage from './paginas/AnuncioDetalhe/AnuncioDetalhePage';
import AprovarUsuariosPage from './paginas/Sindico/AprovarUsuariosPage'; // NOVA PÁGINA SINDICO

// Páginas de Admin (assumindo que já as tem ou irá criar)
import AdminLayout from './paginas/Admin/AdminLayout';
import AdminDashboardPage from './paginas/Admin/AdminDashboardPage';
import UserManagementPage from './paginas/Admin/UserManagementPage';
import CondoManagementPage from './paginas/Admin/CondoManagementPage';
import AnuncioManagementPage from './paginas/Admin/AnuncioManagementPage';
import OfertaManagementPage from './paginas/Admin/OfertaManagementPage';


// Componentes de Layout
import Cabecalho from "./componentes/Cabecalho";
import Rodape from "./componentes/Rodape/Rodape";
// Corpo não é mais necessário envolver Routes aqui, pois Cabecalho e Rodape ficam fora do Routes
// e as páginas individuais ou layouts podem usar o componente Corpo se precisarem de centralização.

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Cabecalho login_link="/login" register_link="/cadastro" />
        <main style={{ flexGrow: 1 }}> {/* Envolve Routes com um main para preencher espaço */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quem-somos" element={<NotFoundPage />} /> {/* Link existe no header */}
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas do Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="usuarios" element={<UserManagementPage />} />
              <Route path="condominios" element={<CondoManagementPage />} />
              <Route path="anuncios" element={<AnuncioManagementPage />} />
              <Route path="ofertas" element={<OfertaManagementPage />} />
            </Route>

            {/* Rotas do Síndico */}
            <Route path="/sindico/aprovar-usuarios" element={<AprovarUsuariosPage />} />

            {/* Rotas de Anúncios e Ofertas (para usuários logados e APROVADOS) */}
            <Route path="/anuncios" element={<AnunciosPage />} />
            <Route path="/anuncios/:id" element={<AnuncioDetalhePage />} />
            <Route path="/meus-anuncios" element={<MeusAnunciosPage />} />
            <Route path="/minhas-ofertas" element={<MinhasOfertasPage />} />
            
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Rodape fb_link="#" ig_link="#" tw_link="#" /> {/* Atualize os links das redes sociais */}
      </div>
    </Router>
  );
}

export default App;