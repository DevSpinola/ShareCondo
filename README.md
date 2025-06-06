# Projeto ShareCondo

## Título do Projeto
ShareCondo: Conectando Vizinhos para uma Comunidade Colaborativa

## Integrantes
* Caio Rocha
* Guilherme Spinola

## Disciplina
Linguagem de Programação II & Modelagem de Software

## Semestre
6º

## Data
01 de junho de 2025

---

## Como Executar o Projeto

Para configurar e executar o projeto ShareCondo, siga estas etapas:

### 1. Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em seu sistema:

* **Java Development Kit (JDK) 17 ou superior**
* **Maven** (geralmente incluído em IDEs como IntelliJ IDEA, ou pode ser instalado separadamente)
* **Node.js (versão 14 ou superior) e npm** (vem com o Node.js)
* **Microsoft SQL Server** (ou acesso a uma instância de SQL Server)
* **Git**

### 2. Configuração do Banco de Dados

1.  **Configuração do SQL Server:**
    * Certifique-se de que sua instância do SQL Server esteja em execução.
    * O arquivo `application.properties` no projeto backend especifica a conexão com o banco de dados:
        ```properties
        spring.datasource.url=jdbc:sqlserver://DESKTOP-MLFH1BJ\\MSSQLSERVER2;databaseName=AulaDB;trustServerCertificate=true
        spring.datasource.username=sa
        spring.datasource.password=123456
        spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
        spring.jpa.show-sql=true
        spring.jpa.hibernate.ddl-auto=update
        api.security.token.secret=${JWT_SECRET:my-secret-key}
        ```
    * **Ajuste `spring.datasource.url`, `username` e `password`** para corresponder às configurações da sua instância local do SQL Server.
    * `spring.jpa.hibernate.ddl-auto=update` irá criar/atualizar automaticamente o esquema do banco de dados com base nas suas entidades JPA quando a aplicação for iniciada.

2.  **Popular Dados Iniciais (Opcional, mas Recomendado):**
    * Navegue até o diretório raiz do repositório clonado.
    * O script `popula_banco.py` pode ser usado para inserir dados iniciais (usuário admin, condomínios, usuários regulares, anúncios e ofertas) no banco de dados.
    * **Antes de executar `popula_banco.py`:**
        * Certifique-se de que o backend esteja em execução (passo 3).
        * Abra `popula_banco.py` e verifique se `BASE_URL` corresponde ao endereço do seu backend (o padrão é `http://localhost:8080`).
        * Certifique-se de que a variável `PASSWORD_PARA_TODOS` esteja definida com uma senha que você deseja usar para os usuários iniciais (o padrão é "123").
    * Execute o script usando Python:
        ```bash
        python popula_banco.py
        ```
    * Este script registrará um usuário administrador (`admin.geral@sharecondo.com`) e outros usuários de teste, condomínios e dados.

### 3. Executar o Backend (Spring Boot)

1.  **Navegue até o diretório do backend:**
    ```bash
    cd share-condo-back-end
    ```
2.  **Compile o projeto usando Maven:**
    ```bash
    mvn clean install
    ```
3.  **Execute a aplicação Spring Boot:**
    ```bash
    mvn spring-boot:run
    ```
    O servidor backend será iniciado, por padrão, em `http://localhost:8080`.

### 4. Executar o Frontend (React)

1.  **Abra uma nova janela do terminal** e navegue até o diretório do frontend:
    ```bash
    cd share-condo-front-end
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento React:**
    ```bash
    npm start
    ```
    Isso abrirá o aplicativo em seu navegador em `http://localhost:3000`. Se não abrir automaticamente, navegue até esta URL.

### 5. Acessando a Aplicação

* Uma vez que tanto o backend quanto o frontend estejam em execução, você pode acessar o aplicativo ShareCondo em seu navegador da web em `http://localhost:3000`.
* Você pode usar as credenciais de administrador de `popula_banco.py` (por exemplo, `admin.geral@sharecondo.com` com a senha `123`) para fazer login e explorar o painel de administração.

---

## Introdução
ShareCondo é uma plataforma projetada para conectar vizinhos dentro de um condomínio, permitindo que eles ofereçam ou solicitem diversas habilidades, serviços e itens. O objetivo principal é fomentar um ambiente colaborativo, onde os moradores possam realizar trocas, empréstimos ou contratar pequenos serviços entre si, como reparos, jardinagem, aulas particulares, ou prática de idiomas.

Este projeto é composto por um backend desenvolvido em Java com Spring Boot e um frontend desenvolvido em React.

## Funcionalidades

**Dentro do Escopo:**
* Gerenciamento de Usuários (Cadastro, Login, Aprovação de Moradores).
* Gerenciamento de Condomínios (Criação e listagem).
* Gerenciamento de Anúncios (Criação, listagem, visualização dos próprios anúncios).
* Gerenciamento de Ofertas (Criação de ofertas para anúncios, aceitação/recusa de ofertas).
* Sistema de autenticação e autorização baseado em papéis (ADMIN, SINDICO, USUARIO).
* Interface front-end para interação do usuário e administração.
* API back-end para processamento das lógicas de negócio e persistência de dados.

**Fora do Escopo:**
* Sistema de pagamento integrado para transações monetárias (as negociações financeiras são de responsabilidade dos usuários).
* Sistema de avaliação e reputação de usuários.
* Comunicação em tempo real (chat) entre usuários (interações são baseadas em ofertas e dados de contato).
* Aplicativo móvel nativo (o foco é uma aplicação web responsiva).

## Tecnologias Utilizadas

**Backend:**
* Java 17
* Spring Boot 3.4.5
* Spring Security
* Spring Data JPA
* Hibernate (via Spring Data JPA)
* `java-jwt` (Auth0) 4.5.0
* Maven (para gerenciamento de dependências e build)
* Microsoft SQL Server (Banco de Dados)
* Tomcat (Servidor Web Embutido - padrão com Spring Boot)

**Frontend:**
* React 19.1.0
* React Router DOM 7.6.0
* Axios 1.9.0 (para requisições HTTP)
* Create React App (como base do projeto frontend)

**Ferramentas de Desenvolvimento:**
* IDE Java (ex: IntelliJ IDEA, Eclipse, VS Code com extensões Java)
* IDE JavaScript/React (ex: VS Code)
* Node.js e npm (para o ambiente de desenvolvimento frontend)
* Git (para controle de versão)
* Postman (para testes de API)
* Navegadores Web (Chrome, Firefox, etc., para desenvolvimento e teste do frontend)

## Visão Geral da Estrutura do Projeto

* `share-condo-back-end/`: Contém a aplicação backend Spring Boot.
    * `src/main/java/br/edu/fesa/ShareCondo/`: Código fonte Java principal.
        * `controller/`: Controladores REST para lidar com as requisições da API.
        * `model/`: Entidades JPA e DTOs.
        * `repositories/`: Repositórios Spring Data JPA para interação com o banco de dados.
        * `infra/security/`: Configurações de segurança (JWT, filtros, etc.).
    * `src/main/resources/application.properties`: Arquivo de propriedades da aplicação backend, incluindo configurações de banco de dados e segredo JWT.
    * `pom.xml`: Arquivo de projeto Maven, define dependências e processo de build.
* `share-condo-front-end/`: Contém a aplicação frontend React.
    * `public/`: Ativos estáticos como `index.html`, `favicon.ico`, `manifest.json`.
    * `src/`: Código fonte React principal.
        * `App.js`: Componente principal da aplicação, definindo as rotas.
        * `componentes/`: Componentes de UI reutilizáveis (ex: Button, Modal, FormInput).
        * `paginas/`: Componentes de nível de página para diferentes visualizações (ex: Home, Login, Admin, Anuncios).
        * `servicos/`: Serviços JavaScript para interagir com a API do backend.
        * `index.css`: Estilos CSS globais.
    * `package.json`: Arquivo de projeto frontend, define dependências e scripts.
* `DOCUMENTO DE ESPECIFICAÇÃO E MODELAGEM DO SISTEMA SHARECONDO.docx`: Documentação completa do projeto.
* `doc.md`: Versão Markdown da documentação.
* `popula_banco.py`: Script Python para popular o banco de dados com dados de teste.
