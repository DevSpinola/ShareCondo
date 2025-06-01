// src/paginas/Admin/EditUserModal.js
import React, { useState, useEffect } from 'react';
import Modal from '../../componentes/Modal/Modal';
import FormInput from '../../componentes/FormInput';
import Button from '../../componentes/Botao/Button';
import './AdminModal.css';

// Mude 'onSave' para 'onSalvar' na desestruturação das props
const EditUserModal = ({ isOpen, onClose, onSalvar, usuarioExistente, condominiosDisponiveis, onSuccess }) => {
    // Log para confirmar a prop recebida
    console.log('[EditUserModal] Prop onSalvar recebida:', onSalvar, 'Tipo:', typeof onSalvar);

    const initialFormState = { // Definido para clareza e reset
        nome: '',
        email: '',
        tipoUsuario: 'USUARIO',
        statusUsuario: 'PENDENTE_APROVACAO',
        condominioId: '',
        senha: '',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        console.log('[EditUserModal useEffect] Disparado. usuarioExistente:', usuarioExistente, 'isOpen:', isOpen);
        if (isOpen && usuarioExistente) {
            const newFormData = {
                nome: usuarioExistente.nome || '',
                email: usuarioExistente.email || '',
                tipoUsuario: usuarioExistente.tipoUsuario || 'USUARIO',
                statusUsuario: usuarioExistente.statusUsuario || 'PENDENTE_APROVACAO',
                condominioId: usuarioExistente.condominioId || '',
                senha: '',
            };
            console.log('[EditUserModal useEffect] Populating formData with:', newFormData);
            setFormData(newFormData);
        } else if (isOpen && !usuarioExistente) {
            console.log('[EditUserModal useEffect] Resetando formData para defaults pois não há usuarioExistente ou o modal apenas abriu.');
            setFormData(initialFormState);
        }
        if (isOpen) {
            setModalError('');
        }
    }, [usuarioExistente, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalError('');

        if (!formData.nome || !formData.email) {
            setModalError('Nome e Email são obrigatórios.');
            return;
        }
        if ((formData.tipoUsuario === 'USUARIO' || formData.tipoUsuario === 'SINDICO') && !formData.condominioId) {
            setModalError('Usuários e Síndicos devem estar associados a um condomínio.');
            return;
        }
        
        const dadosParaSalvar = { ...formData };
        if (!dadosParaSalvar.senha || dadosParaSalvar.senha.trim() === "") {
            delete dadosParaSalvar.senha;
        }

        // Verifique se onSalvar é uma função antes de chamar
        if (typeof onSalvar === 'function') {
            try {
                await onSalvar(dadosParaSalvar); // Agora chama onSalvar (com 'a' minúsculo)
                if(onSuccess) onSuccess(); 
                onClose(); 
            } catch (error) {
                console.error("Erro ao salvar no modal:", error);
                setModalError(error.response?.data?.message || error.message || "Erro ao salvar alterações.");
            }
        } else {
            console.error('[EditUserModal handleSubmit] Erro: onSalvar não é uma função. Valor recebido:', onSalvar);
            setModalError('Erro interno: A função de salvar não foi configurada corretamente.');
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
        value: condo.id,
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