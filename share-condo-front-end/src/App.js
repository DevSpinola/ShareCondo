// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import HomePage from './paginas/Home/HomePage';
import LoginPage from "./paginas/Login/LoginPage";
import CadastroPage from "./paginas/Cadastro/CadastroPage";
import AnunciosPage from './paginas/Anuncios/AnunciosPage';
import NotFoundPage from "./paginas/NotFound/NotFoundPage";

// Páginas de Admin
import AdminDashboardPage from './paginas/Admin/AdminDashboardPage';
import UserManagementPage from './paginas/Admin/UserManagementPage';
import CondoManagementPage from './paginas/Admin/CondoManagementPage';

// Componentes de Layout
import Cabecalho from "./componentes/Cabecalho";
import Rodape from "./componentes/Rodape/Rodape";
import Corpo from './componentes/Corpo';
import AdminLayout from './paginas/Admin/AdminLayout';

// import './App.css'; // Se você tiver um App.css global

function App() {
  return (
    <Router>
      <Cabecalho login_link="/login" register_link="/cadastro" />
      <Corpo> {/* Envolve as rotas que devem ter o estilo do Corpo */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quem-somos" element={<NotFoundPage />} /> {/* Mantido como NotFound por enquanto */}
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Seção de Admin com Sub-rotas */}
          <Route path="/Admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="usuarios" element={<UserManagementPage />} />
            <Route path="condominios" element={<CondoManagementPage />} />
          </Route>

          {/* Nova Seção de Anúncios */}
          <Route path="/anuncios" element={<AnunciosPage />} />
          
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Corpo>
      <Rodape fb_link="/facebook" ig_link="/instagram" tw_link="/twitter" />
    </Router>
  );
}

export default App;