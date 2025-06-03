package br.edu.fesa.ShareCondo.model;

public record CondominioDTO(
        String id,
        String nome,
        String endereco
) {
    public CondominioDTO(Condominio condominio) {
        this(condominio.getId(), condominio.getNome(), condominio.getEndereco());
    }
}