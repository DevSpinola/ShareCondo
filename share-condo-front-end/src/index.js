import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './rotas/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// ROTAS
import naoEncontrada from "./rotas/NotFound";
import Login from "./rotas/Login";
import Cadastro from "./rotas/Cadastro";
import Admin from './rotas/Admin';

// COMPONENTES
import Cabecalho from "./componentes/Cabecalho";
import Rodape from "./componentes/Rodape";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>    
    <Cabecalho login_link="/login" register_link="/cadastro" />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quem-somos" element={naoEncontrada()} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin" element={<Admin/>} />        
        <Route path="/*" element={naoEncontrada()} />
      </Routes>    
    <Rodape fb_link="/facebook" ig_link = "/instagram"  tw_link = "/twitter"/>  
    </BrowserRouter>
  </React.StrictMode>
);

