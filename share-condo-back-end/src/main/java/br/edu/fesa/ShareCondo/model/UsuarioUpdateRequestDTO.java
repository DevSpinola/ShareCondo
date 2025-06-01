package br.edu.fesa.ShareCondo.model;

// Este DTO representa os dados que um admin pode enviar para atualizar um usuário.
// Inclui campos que podem ser nulos se não forem alterados em um PATCH.
public record UsuarioUpdateRequestDTO(
        String nome,
        String email, // Considere implicações de segurança e unicidade ao permitir alteração
        String senha, // Opcional: para alterar a senha
        TipoUsuario tipoUsuario,
        StatusUsuario statusUsuario,
        String condominioId // ID do condomínio para associar/alterar
) {
}