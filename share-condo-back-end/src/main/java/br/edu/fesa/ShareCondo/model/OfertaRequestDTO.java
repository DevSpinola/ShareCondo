package br.edu.fesa.ShareCondo.model;

import java.math.BigDecimal;

public record OfertaRequestDTO(
        TipoOferta tipoOferta,
        BigDecimal valor, // Para TipoOferta.DINHEIRO
        String descricao // Para TipoOferta.ITEM ou TipoOferta.SERVICO
        // Opcional: StatusOferta status (pode ser default PENDENTE no backend)
) {}