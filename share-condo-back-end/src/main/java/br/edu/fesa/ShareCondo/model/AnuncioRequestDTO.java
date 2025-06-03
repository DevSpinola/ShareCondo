package br.edu.fesa.ShareCondo.model;

// Pode-se adicionar anotações de validação como @NotBlank, @NotNull, @Size
public record AnuncioRequestDTO(
        String titulo,
        String descricao,
        TipoAnuncio tipoAnuncio, // ITEM ou SERVICO
        Boolean ativo // Opcional, pode defaultar para true no backend
) {}