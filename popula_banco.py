import requests
import json
import time

BASE_URL = "http://localhost:8080"
HEADERS = {"Content-Type": "application/json"}

# --- Funções Auxiliares (mantidas da versão anterior, com pequenos ajustes) ---
def print_response(response, action="Ação"):
    """Imprime os detalhes da resposta da API."""
    print(f"\n--- {action} ---")
    print(f"URL: {response.url}")
    print(f"Status Code: {response.status_code}")
    try:
        response_json = response.json()
        print(f"Response JSON: {json.dumps(response_json, indent=2, ensure_ascii=False)}")
        return response_json
    except requests.exceptions.JSONDecodeError:
        print(f"Response Text: {response.text}")
        return response.text

def register_user_api(email, nome, senha, tipo_usuario, condominio_id=None):
    """Registra um novo usuário."""
    payload = {
        "email": email,
        "nome": nome,
        "senha": senha,
        "tipoUsuario": tipo_usuario.upper()
    }
    if condominio_id and tipo_usuario.upper() != "ADMIN":
        payload["condominioId"] = condominio_id
    
    print(f"\nRegistrando {tipo_usuario}: {nome} ({email}) com condominioId: {condominio_id if tipo_usuario.upper() != 'ADMIN' else 'N/A'}")
    response = requests.post(f"{BASE_URL}/auth/register", headers=HEADERS, json=payload)
    return print_response(response, f"Registrar {tipo_usuario} {nome}")

def login_api(email, senha):
    """Faz login de um usuário e retorna token e DTO do usuário."""
    payload = {"email": email, "senha": senha}
    print(f"\nFazendo login como: {email}")
    response = requests.post(f"{BASE_URL}/auth/login", headers=HEADERS, json=payload)
    data = print_response(response, f"Login {email}")
    if response.status_code == 200 and isinstance(data, dict):
        return data.get("token"), data.get("usuario")
    return None, None

def create_condominio_api(nome, endereco, admin_token):
    """Cria um novo condomínio."""
    payload = {"nome": nome, "endereco": endereco}
    auth_headers = {**HEADERS, "Authorization": f"Bearer {admin_token}"}
    print(f"\nCriando Condomínio: {nome}")
    response = requests.post(f"{BASE_URL}/condominio", headers=auth_headers, json=payload)
    data = print_response(response, f"Criar Condomínio {nome}")
    if response.status_code == 201 and isinstance(data, dict):
        return data 
    return None

def get_all_users_api(admin_token):
    """Busca todos os usuários (requer token de admin)."""
    auth_headers = {**HEADERS, "Authorization": f"Bearer {admin_token}"}
    print("\nBuscando todos os usuários...")
    response = requests.get(f"{BASE_URL}/usuario", headers=auth_headers)
    data = print_response(response, "Buscar Todos os Usuários")
    if response.status_code == 200 and isinstance(data, list):
        return data
    return []

def approve_user_api(user_id_to_approve, approver_token):
    """Aprova um usuário."""
    auth_headers = {**HEADERS, "Authorization": f"Bearer {approver_token}"}
    print(f"\nAprovando usuário ID: {user_id_to_approve}")
    response = requests.patch(f"{BASE_URL}/usuario/{user_id_to_approve}/aprovar", headers=auth_headers)
    return print_response(response, f"Aprovar Usuário {user_id_to_approve}")

def create_anuncio_api(titulo, descricao, tipo_anuncio, user_token):
    """Cria um novo anúncio."""
    payload = {"titulo": titulo, "descricao": descricao, "tipoAnuncio": tipo_anuncio.upper(), "ativo": True}
    auth_headers = {**HEADERS, "Authorization": f"Bearer {user_token}"}
    print(f"\nCriando Anúncio: {titulo}")
    response = requests.post(f"{BASE_URL}/anuncios", headers=auth_headers, json=payload)
    data = print_response(response, f"Criar Anúncio {titulo}")
    if response.status_code == 201 and isinstance(data, dict):
        return data 
    return None

def create_oferta_api(anuncio_id, tipo_oferta, ofertante_token, valor=None, descricao_oferta=None):
    """Cria uma nova oferta para um anúncio."""
    payload = {"tipoOferta": tipo_oferta.upper()}
    if tipo_oferta.upper() == "DINHEIRO" and valor is not None:
        payload["valor"] = float(valor) # Garante que é float
    if (tipo_oferta.upper() == "ITEM" or tipo_oferta.upper() == "SERVICO") and descricao_oferta:
        payload["descricao"] = descricao_oferta
    
    auth_headers = {**HEADERS, "Authorization": f"Bearer {ofertante_token}"}
    print(f"\nCriando Oferta para Anúncio ID: {anuncio_id} do tipo {tipo_oferta}")
    response = requests.post(f"{BASE_URL}/ofertas/anuncio/{anuncio_id}", headers=auth_headers, json=payload)
    data = print_response(response, f"Criar Oferta para Anúncio {anuncio_id}")
    if response.status_code == 201 and isinstance(data, dict):
        return data 
    return None

# --- Lógica Principal de População ---
def populate():
    print("Iniciando script de população v2 do banco de dados ShareCondo...")
    PASSWORD_PARA_TODOS = "123"
    
    created_data = {
        "admin": None,
        "condominios_criados": [], 
        "sindicos_logados": {},    
        "usuarios_registrados_para_aprovar": [], 
        "usuarios_finalizados": [],   # Guarda {email, pass, nome, condominio_id, token, dto_login, status_final}
        "anuncios_criados": []     
    }

    # Passo 1: Admin
    admin_email = "admin.geral@sharecondo.com"
    admin_nome = "Administrador Geral ShareCondo"
    
    admin_token, admin_user_dto = login_api(admin_email, PASSWORD_PARA_TODOS)
    if not admin_token:
        print(f"Admin {admin_email} não encontrado ou login falhou. Tentando registrar...")
        register_user_api(admin_email, admin_nome, PASSWORD_PARA_TODOS, "ADMIN")
        time.sleep(0.5) 
        admin_token, admin_user_dto = login_api(admin_email, PASSWORD_PARA_TODOS)

    if not admin_token or not admin_user_dto:
        print("!!! CRÍTICO: Não foi possível obter o token do admin. Saindo. !!!")
        return
    created_data["admin"] = {"token": admin_token, "dto_login": admin_user_dto, "email": admin_email, "nome": admin_nome}
    print(f"Admin '{admin_user_dto.get('email')}' pronto.")

    # Passo 2: Criar Condomínios
    condominios_data = [
        {"nome": "Residencial Vila das Flores", "endereco": "Rua Primavera, 10, Bairro Florido"},
        {"nome": "Condomínio Bosque Imperial", "endereco": "Alameda dos Reis, 777, Jardim Real"},
    ]
    for condo_spec in condominios_data:
        condo_dto = create_condominio_api(condo_spec["nome"], condo_spec["endereco"], admin_token)
        if condo_dto:
            created_data["condominios_criados"].append(condo_dto)
        time.sleep(0.2)
    
    if not created_data["condominios_criados"]:
        print("!!! CRÍTICO: Nenhum condomínio foi criado. Verifique o token do admin e o endpoint. Saindo. !!!")
        return

    # Obter emails existentes para evitar duplicação
    time.sleep(0.5) # dar um tempo para o servidor processar antes de buscar usuários
    all_users_initial_list = get_all_users_api(admin_token)
    existing_emails = {u['email'] for u in all_users_initial_list} if all_users_initial_list else set()

    # Passo 3 & 4: Registrar Síndicos e Usuários
    usuarios_specs = [
        # Sindicos (auto-aprovados no registro)
        {"email_suffix": "sindico.flores", "nome_prefix": "Sra. Helena", "tipo": "SINDICO", "condominio_idx": 0},
        {"email_suffix": "sindico.imperial", "nome_prefix": "Sr. Ricardo", "tipo": "SINDICO", "condominio_idx": 1},
        # Usuários para Condomínio Vila das Flores
        {"email_suffix": "ana.vflores", "nome_prefix": "Ana Pereira", "tipo": "USUARIO", "condominio_idx": 0},
        {"email_suffix": "bruno.vflores", "nome_prefix": "Bruno Costa", "tipo": "USUARIO", "condominio_idx": 0},
        {"email_suffix": "clara.vflores", "nome_prefix": "Clara Martins", "tipo": "USUARIO", "condominio_idx": 0},
        # Usuários para Condomínio Bosque Imperial
        {"email_suffix": "davi.bimperial", "nome_prefix": "Davi Oliveira", "tipo": "USUARIO", "condominio_idx": 1},
        {"email_suffix": "elena.bimperial", "nome_prefix": "Elena Santos", "tipo": "USUARIO", "condominio_idx": 1},
        {"email_suffix": "felipe.bimperial", "nome_prefix": "Felipe Almeida", "tipo": "USUARIO", "condominio_idx": 1},
        {"email_suffix": "giselle.bimperial", "nome_prefix": "Giselle Lima", "tipo": "USUARIO", "condominio_idx": 1},
    ]

    for user_spec in usuarios_specs:
        condo_ref = created_data["condominios_criados"][user_spec["condominio_idx"]]
        user_email = f"{user_spec['email_suffix']}@exemplo.com"
        user_nome = user_spec['nome_prefix'] # MODIFICADO AQUI
        
        user_entry = {
            "email": user_email, "pass": PASSWORD_PARA_TODOS, "nome": user_nome, 
            "condominio_id": condo_ref["id"], "condominio_nome": condo_ref["nome"],
            "tipo": user_spec["tipo"], "token": None, "dto_login": None, "status_final": "NAO_PROCESSADO"
        }

        if user_email not in existing_emails:
            register_user_api(user_email, user_nome, PASSWORD_PARA_TODOS, user_spec["tipo"], condo_ref["id"])
            existing_emails.add(user_email)
            if user_spec["tipo"] == "USUARIO":
                created_data["usuarios_registrados_para_aprovar"].append(user_entry)
            elif user_spec["tipo"] == "SINDICO": # Sindicos são auto-aprovados
                token, dto = login_api(user_email, PASSWORD_PARA_TODOS)
                if token and dto:
                    user_entry["token"] = token
                    user_entry["dto_login"] = dto
                    user_entry["status_final"] = "APROVADO_LOGADO"
                    created_data["sindicos_logados"][condo_ref["id"]] = user_entry
                else:
                    user_entry["status_final"] = "FALHA_LOGIN_POS_REGISTRO_SINDICO"
            created_data["usuarios_finalizados"].append(user_entry)
            time.sleep(0.2)
        else:
            print(f"Usuário {user_email} (tipo: {user_spec['tipo']}) já existe.")
            # Tentar logar se já existe, pode já estar aprovado.
            token, dto = login_api(user_email, PASSWORD_PARA_TODOS)
            if token and dto:
                user_entry["token"] = token
                user_entry["dto_login"] = dto
                user_entry["status_final"] = "EXISTENTE_LOGADO"
                if user_spec["tipo"] == "SINDICO":
                     created_data["sindicos_logados"][condo_ref["id"]] = user_entry
            else:
                user_entry["status_final"] = "EXISTENTE_FALHA_LOGIN"
            created_data["usuarios_finalizados"].append(user_entry)
            
    time.sleep(1)

    # Passo 5: Aprovar Usuários
    print("\nBuscando todos os usuários novamente para aprovações...")
    all_users_data_after_regs = get_all_users_api(admin_token)
    
    for user_entry_to_process in created_data["usuarios_registrados_para_aprovar"]:
        user_dto_from_db = next((u for u in all_users_data_after_regs if u['email'] == user_entry_to_process['email']), None)
        
        if user_dto_from_db:
            user_entry_to_process["dto_login"] = user_dto_from_db # Armazena o DTO como estava antes da aprovação
            if user_dto_from_db['statusUsuario'] == "PENDENTE_APROVACAO":
                print(f"Usuário pendente encontrado: {user_dto_from_db['email']} (ID: {user_dto_from_db['id']})")
                
                approver_token_to_use = admin_token
                sindico_do_condo = created_data["sindicos_logados"].get(user_entry_to_process["condominio_id"])

                if sindico_do_condo and sindico_do_condo["token"]:
                    approver_token_to_use = sindico_do_condo["token"]
                    print(f"Usando token do síndico {sindico_do_condo['email']} para aprovação.")
                else:
                    print(f"Síndico para o condomínio {user_entry_to_process['condominio_nome']} não logado, usando admin para aprovar.")

                approval_response = approve_user_api(user_dto_from_db['id'], approver_token_to_use)
                time.sleep(0.2)

                if approval_response and approval_response.get("statusUsuario") == "APROVADO":
                    token, dto_login_pos_aprovacao = login_api(user_entry_to_process["email"], user_entry_to_process["pass"])
                    if token and dto_login_pos_aprovacao:
                        user_entry_to_process["token"] = token
                        user_entry_to_process["dto_login"] = dto_login_pos_aprovacao # Atualiza com DTO pós login
                        user_entry_to_process["status_final"] = "APROVADO_LOGADO"
                    else:
                        user_entry_to_process["status_final"] = "APROVADO_FALHA_LOGIN"
                else:
                    user_entry_to_process["status_final"] = "FALHA_APROVACAO"
            elif user_dto_from_db['statusUsuario'] == "APROVADO":
                print(f"Usuário {user_dto_from_db['email']} já estava aprovado.")
                token, dto_login = login_api(user_entry_to_process["email"], user_entry_to_process["pass"])
                if token and dto_login:
                    user_entry_to_process["token"] = token
                    user_entry_to_process["dto_login"] = dto_login
                    user_entry_to_process["status_final"] = "PREVIAMENTE_APROVADO_LOGADO"
                else:
                    user_entry_to_process["status_final"] = "PREVIAMENTE_APROVADO_FALHA_LOGIN"
            else: # REJEITADO ou outro status
                 user_entry_to_process["status_final"] = f"STATUS_INESPERADO_{user_dto_from_db['statusUsuario']}"
        else:
            print(f"!!! Usuário {user_entry_to_process['email']} não encontrado na lista de usuários para tentativa de aprovação.")
            user_entry_to_process["status_final"] = "NAO_ENCONTRADO_PARA_APROVACAO"


    # Atualiza a lista principal de usuários finalizados com os resultados da aprovação
    final_user_list = []
    processed_emails = set()
    for user_entry in created_data["usuarios_registrados_para_aprovar"]: # Prioriza os que passaram pelo fluxo de aprovação
        final_user_list.append(user_entry)
        processed_emails.add(user_entry["email"])
    for user_entry in created_data["usuarios_finalizados"]: # Adiciona os que não estavam na lista de aprovar (sindicos, existentes)
        if user_entry["email"] not in processed_emails:
            final_user_list.append(user_entry)
    created_data["usuarios_finalizados"] = final_user_list


    active_user_sessions = [u for u in created_data["usuarios_finalizados"] if u["token"] and u["dto_login"] and u["dto_login"].get("statusUsuario") == "APROVADO"]
    if not active_user_sessions:
        print("!!! Não há usuários ativos logados para criar anúncios/ofertas. Verifique os logs de aprovação e login. !!!")
    else:
        print(f"\nUsuários ativos logados para próximas ações: {len(active_user_sessions)}")

    # Passo 6: Criar Anúncios (total ~8)
    anuncios_a_criar = [
        {"idx_user": 0, "titulo": "Monitor Dell 24 polegadas Full HD", "desc": "Modelo P2419H, excelente estado, pouco uso, com caixa.", "tipo": "ITEM"},
        {"idx_user": 0, "titulo": "Consultoria Financeira Pessoal", "desc": "Organização de orçamento, planilhas e dicas de investimento.", "tipo": "SERVICO"},
        {"idx_user": 1, "titulo": "Bicicleta Infantil Aro 16", "desc": "Marca Caloi, cor azul, bom estado, ideal para crianças de 4-6 anos.", "tipo": "ITEM"},
        {"idx_user": 1, "titulo": "Serviço de Passeador de Cães (Dog Walker)", "desc": "Passeios diários ou esporádicos na região do condomínio.", "tipo": "SERVICO"},
        {"idx_user": 2, "titulo": "Videogame PlayStation 4 Slim + 2 Controles", "desc": "Usado, funcionando perfeitamente. Acompanha jogos.", "tipo": "ITEM"},
        {"idx_user": 3, "titulo": "Aulas Particulares de Inglês", "desc": "Níveis básico e intermediário. Foco em conversação.", "tipo": "SERVICO"},
        {"idx_user": 4, "titulo": "Teclado Mecânico Gamer Redragon", "desc": "Switch azul, RGB, semi-novo.", "tipo": "ITEM"},
    ]
    if created_data["admin"]["token"]: # Admin também cria um anúncio
         admin_anuncio_dto = create_anuncio_api(
             "Mentoria para Síndicos Iniciantes", 
             "Consultoria sobre gestão condominial, finanças e mediação de conflitos.", 
             "SERVICO", 
             created_data["admin"]["token"]
         )
         if admin_anuncio_dto: created_data["anuncios_criados"].append(admin_anuncio_dto)
         time.sleep(0.2)

    for i, anuncio_spec in enumerate(anuncios_a_criar):
        if anuncio_spec["idx_user"] < len(active_user_sessions):
            user_session = active_user_sessions[anuncio_spec["idx_user"]]
            anuncio_dto = create_anuncio_api(anuncio_spec["titulo"], anuncio_spec["desc"], anuncio_spec["tipo"], user_session["token"])
            if anuncio_dto: created_data["anuncios_criados"].append(anuncio_dto)
            time.sleep(0.2)
        else:
            print(f"Skipping anuncio '{anuncio_spec['titulo']}' - índice de usuário {anuncio_spec['idx_user']} fora do alcance ({len(active_user_sessions)} usuários ativos).")


    # Passo 7: Criar Ofertas (total ~7)
    ofertas_a_criar = [
        # Oferta para o Monitor Dell (anúncio 0, do user 0) pelo user 1
        {"idx_anuncio": 0, "idx_ofertante": 1, "tipo": "DINHEIRO", "valor": 350.00},
        # Oferta para as Aulas de Yoga (anúncio 1, do user 0) pelo user 2
        {"idx_anuncio": 1, "idx_ofertante": 2, "tipo": "SERVICO", "desc": "Troco por 2 horas de revisão de documentos ABNT."},
        # Oferta para a Bicicleta Infantil (anúncio 2, do user 1) pelo user 0
        {"idx_anuncio": 2, "idx_ofertante": 0, "tipo": "ITEM", "desc": "Ofereço um skate usado em bom estado."},
        # Oferta para o Dog Walker (anúncio 3, do user 1) pelo user 3
        {"idx_anuncio": 3, "idx_ofertante": 3, "tipo": "DINHEIRO", "valor": 25.00}, # Valor por passeio
        # Oferta para o PS4 (anúncio 4, do user 2) pelo user 4
        {"idx_anuncio": 4, "idx_ofertante": 4, "tipo": "DINHEIRO", "valor": 700.00},
        # Oferta para Aulas de Inglês (anúncio 5, do user 3) pelo user 1
        {"idx_anuncio": 5, "idx_ofertante": 1, "tipo": "SERVICO", "desc": "Posso oferecer ajuda com pequenas reformas (pintura)."},
        # Oferta para o Teclado Mecânico (anúncio 6, do user 4) pelo user 0
        {"idx_anuncio": 6, "idx_ofertante": 0, "tipo": "ITEM", "desc": "Troco por um mouse gamer Logitech G203."},
    ]

    for i, oferta_spec in enumerate(ofertas_a_criar):
        if oferta_spec["idx_anuncio"] < len(created_data["anuncios_criados"]) and \
           oferta_spec["idx_ofertante"] < len(active_user_sessions):
            
            anuncio_alvo = created_data["anuncios_criados"][oferta_spec["idx_anuncio"]]
            ofertante_session = active_user_sessions[oferta_spec["idx_ofertante"]]

            anunciante_id = anuncio_alvo.get("anunciante", {}).get("id")
            ofertante_id = ofertante_session.get("dto_login", {}).get("id")

            if anunciante_id == ofertante_id:
                print(f"Skipping oferta: Ofertante {ofertante_session['dto_login']['email']} é o dono do anúncio '{anuncio_alvo['titulo']}'.")
                continue
            
            # Lógica de mesmo condomínio (simplificada, asume-se que se não for admin, deve ser mesmo condomínio)
            anunciante_condo_id = anuncio_alvo.get("anunciante", {}).get("condominioId")
            ofertante_condo_id = ofertante_session.get("dto_login", {}).get("condominioId")
            admin_id = created_data["admin"]["dto_login"].get("id")

            permitir_oferta = False
            if ofertante_id == admin_id or anunciante_id == admin_id: # Se admin está envolvido
                permitir_oferta = True
            elif anunciante_condo_id and ofertante_condo_id and anunciante_condo_id == ofertante_condo_id:
                permitir_oferta = True
            
            if permitir_oferta:
                create_oferta_api(
                    anuncio_alvo["id"], 
                    oferta_spec["tipo"], 
                    ofertante_session["token"],
                    valor=oferta_spec.get("valor"),
                    descricao_oferta=oferta_spec.get("desc")
                )
                time.sleep(0.2)
            else:
                print(f"Skipping oferta de {ofertante_session['dto_login']['email']} para anúncio '{anuncio_alvo['titulo']}' por {anunciante_id} - regra de condomínio.")
        else:
            print(f"Skipping oferta - índice de anúncio ou ofertante fora do alcance. Anúncio Idx: {oferta_spec['idx_anuncio']}, Ofertante Idx: {oferta_spec['idx_ofertante']}")


    print("\n\n========= RESUMO FINAL DA POPULAÇÃO ==========")
    if created_data["admin"] and created_data["admin"]["dto_login"]:
        print(f"Admin: {created_data['admin']['dto_login']['email']} (ID: {created_data['admin']['dto_login']['id']})")
    
    print(f"\nCondomínios Criados ({len(created_data['condominios_criados'])}):")
    for condo in created_data["condominios_criados"]:
        sindico_info = created_data["sindicos_logados"].get(condo["id"])
        sindico_email_display = sindico_info['email'] if sindico_info else "N/A"
        print(f"  - Nome: {condo.get('nome')}, End.: {condo.get('endereco')} (ID: {condo.get('id')})")
        print(f"    Síndico: {sindico_email_display}")
        
    print(f"\nUsuários Finalizados ({len(created_data['usuarios_finalizados'])}):")
    for u_data in created_data["usuarios_finalizados"]:
        email = u_data['email']
        status = u_data['status_final']
        nome_condo = u_data.get('dto_login', {}).get('condominioNome', u_data.get('condominio_nome', 'N/A'))
        user_id = u_data.get('dto_login', {}).get('id', 'N/A')
        print(f"  - Email: {email} (ID: {user_id}), Tipo: {u_data['tipo']}, Condomínio: {nome_condo}, Status Final no Script: {status}")
    
    print(f"\nAnúncios Criados ({len(created_data['anuncios_criados'])}):")
    for anuncio in created_data["anuncios_criados"]:
        anunciante_nome = anuncio.get("anunciante", {}).get("nome", "Desconhecido")
        print(f"  - Título: '{anuncio.get('titulo')}' (ID: {anuncio.get('id')}), Por: {anunciante_nome}")

    print("\n--- Script de População v2 Concluído ---")

if __name__ == "__main__":
    populate()