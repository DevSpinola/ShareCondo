package br.edu.fesa.ShareCondo.model;

public record RegisterDTO(
        String email,
        String nome,
        String senha,
        TipoUsuario tipoUsuario,
        String condominioId // NOVO CAMPO
) {
}