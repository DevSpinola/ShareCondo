// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import HomePage from './paginas/Home/HomePage';
import LoginPage from "./paginas/Login/LoginPage";
import CadastroPage from "./paginas/Cadastro/CadastroPage";
import AnunciosPage from './paginas/Anuncios/AnunciosPage';
import MeusAnunciosPage from './paginas/MeusAnuncios/MeusAnunciosPage'; // Novo
import MinhasOfertasPage from './paginas/MinhasOfertas/MinhasOfertasPage'; // Novo
import NotFoundPage from "./paginas/NotFound/NotFoundPage";

// Páginas de Admin
import AdminDashboardPage from './paginas/Admin/AdminDashboardPage';
import UserManagementPage from './paginas/Admin/UserManagementPage';
import CondoManagementPage from './paginas/Admin/CondoManagementPage';
import AnuncioManagementPage from './paginas/Admin/AnuncioManagementPage'; 
import OfertaManagementPage from './paginas/Admin/OfertaManagementPage';   

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
            <Route index element={<AdminDashboardPage />} />
            <Route path="usuarios" element={<UserManagementPage />} />
            <Route path="condominios" element={<CondoManagementPage />} />
            <Route path="anuncios" element={<AnuncioManagementPage />} /> 
            <Route path="ofertas" element={<OfertaManagementPage />} />  
          </Route>

          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/meus-anuncios" element={<MeusAnunciosPage />} /> {/* Nova rota */}
          <Route path="/minhas-ofertas" element={<MinhasOfertasPage />} /> {/* Nova rota */}
          
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Corpo>
      <Rodape fb_link="/facebook" ig_link="/instagram" tw_link="/twitter" />
    </Router>
  );
}

export default App;