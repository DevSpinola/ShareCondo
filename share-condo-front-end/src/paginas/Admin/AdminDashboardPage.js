// src/componentes/Admin/AdminDashboard.js
import React from 'react';
import './AdminDashboardPage.css'; // Importar o CSS

const AdminDashboardPage = () => { // Nome do componente atualizado para corresponder ao nome do arquivo
  return (
    <div className="admin-dashboard"> {/* Adicionada classe para estilização */}
      <h1>Painel de Controle Administrativo</h1>
      <img src="/imagens/admin.png" alt="Painel Administrativo ShareCondo" className="admin-dashboard-image" />
      <p>
        Bem-vindo à área administrativa do ShareCondo!
      </p>
      <p>
        A partir daqui, você tem o poder de gerenciar todos os aspectos da plataforma.
        Utilize o menu ao lado para navegar entre as diferentes seções:
      </p>
      <ul>
        <li><strong>Gerenciar Usuários:</strong> Visualize, edite, aprove, rejeite ou remova contas de usuários.</li>
        <li><strong>Gerenciar Condomínios:</strong> Adicione novos condomínios ou atualize informações dos existentes.</li>
        <li><strong>Gerenciar Anúncios:</strong> Modere e gerencie todos os anúncios criados na plataforma.</li>
        <li><strong>Gerenciar Ofertas:</strong> Visualize e, se necessário, intervenha nas ofertas realizadas.</li>
      </ul>
      <p>
        Use estas ferramentas com responsabilidade para manter a plataforma segura, organizada e funcional para todos os membros da comunidade ShareCondo.
      </p>
    </div>
  );
};

export default AdminDashboardPage; // Nome do export atualizado