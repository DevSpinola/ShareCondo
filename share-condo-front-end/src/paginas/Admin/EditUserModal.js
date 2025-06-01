// src/paginas/Admin/EditUserModal.js
import React, { useState, useEffect } from 'react';
import Modal from '../../componentes/Modal/Modal';
import FormInput from '../../componentes/FormInput';
import Button from '../../componentes/Botao/Button';
import './AdminModal.css';

// Adicionada prop onSuccess para notificar a página pai
const EditUserModal = ({ isOpen, onClose, onSave, usuarioExistente, condominiosDisponiveis, onSuccess }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        tipoUsuario: 'USUARIO',
        statusUsuario: 'PENDENTE_APROVACAO',
        condominioId: '',
        senha: '',
    });
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        if (usuarioExistente) {
            setFormData({
                nome: usuarioExistente.nome || '',
                email: usuarioExistente.email || '',
                tipoUsuario: usuarioExistente.tipoUsuario || 'USUARIO',
                statusUsuario: usuarioExistente.statusUsuario || 'PENDENTE_APROVACAO',
                condominioId: usuarioExistente.condominioId || '', // UsuarioDTO já deve ter condominioId
                senha: '',
            });
        } else {
            setFormData({
                nome: '', email: '', tipoUsuario: 'USUARIO', 
                statusUsuario: 'PENDENTE_APROVACAO', condominioId: '', senha: ''
            });
        }
        setModalError('');
    }, [usuarioExistente, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => { // Tornar async para poder usar await em onSave se necessário
        e.preventDefault();
        setModalError('');

        if (!formData.nome || !formData.email) {
            setModalError('Nome e Email são obrigatórios.');
            return;
        }
        // Usuários e Síndicos (não ADMIN) devem ter um condomínio (a menos que o admin possa desvincular com condominioId = "")
        if ((formData.tipoUsuario === 'USUARIO' || formData.tipoUsuario === 'SINDICO') && !formData.condominioId) {
            setModalError('Usuários e Síndicos devem estar associados a um condomínio.');
            return;
        }
        
        const dadosParaSalvar = { ...formData };
        if (!dadosParaSalvar.senha || dadosParaSalvar.senha.trim() === "") {
            delete dadosParaSalvar.senha; // Não enviar campo senha se vazio
        }

        try {
            // onSave é a função handleSalvarEdicao do CrudTabela, que chama updateById
            await onSave(dadosParaSalvar); 
            // onSuccess é o handleDataChange da UserManagementPage, chamado pelo CrudTabela ao ter sucesso no updateById.
            // O CrudTabela já deve recarregar os dados ao chamar seu próprio onSave.
            // Se quisermos fechar o modal aqui após o sucesso, o onSave não deve fechar automaticamente.
            // Por ora, o fechamento é responsabilidade do CrudTabela ou da UserManagementPage que controla 'isOpen'.
            // A prop 'onSuccess' aqui pode não ser estritamente necessária se o CrudTabela já atualiza.
            if(onSuccess) onSuccess(); // Chama o refresh da UserManagementPage, se passado.
            onClose(); // Fechar o modal após salvar.
        } catch (error) {
            // O erro já deve ser tratado e exibido pela UserManagementPage ou CrudTabela
            // mas podemos ter um feedback local também se a prop onSave não tratar.
            console.error("Erro ao salvar no modal:", error);
            setModalError(error.response?.data?.message || error.message || "Erro ao salvar alterações.");
        }
    };

    const tiposUsuario = [
        { value: 'USUARIO', label: 'Usuário Comum' },
        { value: 'SINDICO', label: 'Síndico' },
        { value: 'ADMIN', label: 'Administrador' },
    ];

    const statusUsuarioOptions = [
        { value: 'PENDENTE_APROVACAO', label: 'Pendente Aprovação' },
        { value: 'APROVADO', label: 'Aprovado' },
        { value: 'REJEITADO', label: 'Rejeitado' },
    ];

    const condominiosOptions = Array.isArray(condominiosDisponiveis) ? condominiosDisponiveis.map(condo => ({
        value: condo.id, // UsuarioDTO deve ter condominioId
        label: `${condo.nome}${condo.endereco ? ' - ' + condo.endereco : ''}`
    })) : [];


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={usuarioExistente ? "Editar Usuário" : "Adicionar Usuário"}>
            <form onSubmit={handleSubmit} className="admin-modal-form">
                {modalError && <p className="modal-error">{modalError}</p>}
                <FormInput
                    label="Nome:"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Email:"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    // readOnly={!!usuarioExistente} // Emails geralmente não são editáveis
                />
                <FormInput
                    label="Nova Senha (deixe em branco para não alterar):"
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                />
                <FormInput
                    label="Tipo de Usuário:"
                    name="tipoUsuario"
                    type="select"
                    value={formData.tipoUsuario}
                    onChange={handleChange}
                    options={tiposUsuario}
                    required
                />
                <FormInput
                    label="Status da Conta:"
                    name="statusUsuario"
                    type="select"
                    value={formData.statusUsuario}
                    onChange={handleChange}
                    options={statusUsuarioOptions}
                    required
                />
                
                <FormInput
                    label="Condomínio:"
                    name="condominioId"
                    type="select"
                    value={formData.condominioId}
                    onChange={handleChange}
                    options={[{ value: '', label: 'Nenhum / Não Associado' }, ...condominiosOptions]}
                    // Não é obrigatório para ADMIN, mas pode ser para USUARIO/SINDICO
                    required={(formData.tipoUsuario === 'USUARIO' || formData.tipoUsuario === 'SINDICO')} 
                />

                <div className="admin-modal-actions">
                    <Button type="submit" className="button-save">Salvar</Button>
                    <Button type="button" onClick={onClose} className="button-cancel">Cancelar</Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditUserModal;