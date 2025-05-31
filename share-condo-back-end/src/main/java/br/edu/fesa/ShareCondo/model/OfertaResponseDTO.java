package br.edu.fesa.ShareCondo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OfertaResponseDTO(
        String id,
        String anuncioId,
        UsuarioDTO ofertante,
        TipoOferta tipoOferta,
        BigDecimal valor,
        String descricao,
        LocalDateTime dataOferta,
        StatusOferta status
) {
    public OfertaResponseDTO(Oferta oferta) {
        this(
                oferta.getId(),
                oferta.getAnuncio() != null ? oferta.getAnuncio().getId() : null,
                oferta.getOfertante() != null ? new UsuarioDTO(oferta.getOfertante()) : null,
                oferta.getTipoOferta(),
                oferta.getValor(),
                oferta.getDescricao(),
                oferta.getDataOferta(),
                oferta.getStatus()
        );
    }
}