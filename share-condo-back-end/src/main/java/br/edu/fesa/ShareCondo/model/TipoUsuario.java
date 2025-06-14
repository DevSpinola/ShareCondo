package br.edu.fesa.ShareCondo.model;

public enum TipoUsuario {
    ADMIN("admin"),
    SINDICO("sindico"), // NOVO TIPO
    USUARIO("usuario");

    private String tipo;

    TipoUsuario(String tipo) {
        this.tipo = tipo;
    }

    public String getTipo() {
        return tipo;
    }
}