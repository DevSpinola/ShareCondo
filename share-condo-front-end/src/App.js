// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Rotas Principais
import Home from './rotas/Home';
import LoginPage from "./rotas/Login"; // Renomeado de Login para LoginPage para consistência
import CadastroPage from "./rotas/Cadastro"; // Renomeado de Cadastro para CadastroPage
import AdminLayout from './componentes/Admin/AdminLayout'; // Novo Layout para Admin
import AdminDashboard from './componentes/Admin/AdminDashboard';
import UserManagement from './componentes/Admin/UserManagement';
import CondoManagement from './componentes/Admin/CondoManagement';
import AnunciosPage from './componentes/Anuncios/AnunciosPage'; // Nova página de Anúncios
import NotFoundPage from "./rotas/NotFound"; // Renomeado de naoEncontrada para NotFoundPage

// Componentes
import Cabecalho from "./componentes/Cabecalho";
import Rodape from "./componentes/Rodape";
import Corpo from './componentes/Corpo';

//import './App.css'; // Se você tiver um App.css global

function App() {
  return (
    <Router>
      <Cabecalho login_link="/login" register_link="/cadastro" />
      <Corpo> {/* Envolve as rotas que devem ter o estilo do Corpo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quem-somos" element={<NotFoundPage />} /> {/* Mantido como NotFound por enquanto */}
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Seção de Admin com Sub-rotas */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="usuarios" element={<UserManagement />} />
            <Route path="condominios" element={<CondoManagement />} />
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