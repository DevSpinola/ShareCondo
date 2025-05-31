package br.edu.fesa.ShareCondo.model;

import br.edu.fesa.ShareCondo.model.TipoUsuario;

public record UsuarioDTO(
        String id,
        String nome,
        String email,
        TipoUsuario tipoUsuario
) {
    public UsuarioDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario()
        );
    }
}
