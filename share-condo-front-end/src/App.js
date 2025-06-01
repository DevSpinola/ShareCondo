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
import AprovarUsuariosPage from './paginas/Sindico/AprovarUsuariosPage';
import QuemSomosPage from './paginas/QuemSomos/QuemSomosPage'; // <<< --- IMPORTAR NOVA PÁGINA

// Páginas de Admin
import AdminLayout from './paginas/Admin/AdminLayout';
import AdminDashboardPage from './paginas/Admin/AdminDashboardPage';
import UserManagementPage from './paginas/Admin/UserManagementPage';
import CondoManagementPage from './paginas/Admin/CondoManagementPage';
import AnuncioManagementPage from './paginas/Admin/AnuncioManagementPage';
import OfertaManagementPage from './paginas/Admin/OfertaManagementPage';

// Componentes de Layout
import Cabecalho from "./componentes/Cabecalho";
import Rodape from "./componentes/Rodape/Rodape";

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Cabecalho login_link="/login" register_link="/cadastro" />
        <main style={{ flexGrow: 1, backgroundColor: '#fff' }}> {/* Adicionado backgroundColor para consistência */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quem-somos" element={<QuemSomosPage />} /> {/* <<< --- ATUALIZAR ROTA */}
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="usuarios" element={<UserManagementPage />} />
              <Route path="condominios" element={<CondoManagementPage />} />
              <Route path="anuncios" element={<AnuncioManagementPage />} />
              <Route path="ofertas" element={<OfertaManagementPage />} />
            </Route>

            <Route path="/sindico/aprovar-usuarios" element={<AprovarUsuariosPage />} />

            <Route path="/anuncios" element={<AnunciosPage />} />
            <Route path="/anuncios/:id" element={<AnuncioDetalhePage />} />
            <Route path="/meus-anuncios" element={<MeusAnunciosPage />} />
            <Route path="/minhas-ofertas" element={<MinhasOfertasPage />} />
            
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Rodape fb_link="#" ig_link="#" tw_link="#" />
      </div>
    </Router>
  );
}

export default App;