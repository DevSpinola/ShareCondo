package br.edu.fesa.ShareCondo.model;

public record UsuarioDTO(
        String id,
        String nome,
        String email,
        TipoUsuario tipoUsuario,
        String condominioId,    // NOVO
        String condominioNome,  // NOVO
        StatusUsuario statusUsuario // NOVO
) {
    public UsuarioDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario(),
                usuario.getCondominio() != null ? usuario.getCondominio().getId() : null,
                usuario.getCondominio() != null ? usuario.getCondominio().getNome() : null,
                usuario.getStatusUsuario()
        );
    }
}