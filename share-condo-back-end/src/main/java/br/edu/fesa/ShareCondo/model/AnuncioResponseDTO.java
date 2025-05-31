package br.edu.fesa.ShareCondo.model;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public record AnuncioResponseDTO(
        String id,
        String titulo,
        String descricao,
        TipoAnuncio tipoAnuncio,
        UsuarioDTO anunciante,
        LocalDateTime dataCriacao,
        boolean ativo,
        List<OfertaResponseDTO> ofertasRecebidas
) {
    public AnuncioResponseDTO(Anuncio anuncio) {
        this(
                anuncio.getId(),
                anuncio.getTitulo(),
                anuncio.getDescricao(),
                anuncio.getTipoAnuncio(),
                (anuncio.getAnunciante() != null) ? new UsuarioDTO(anuncio.getAnunciante()) : null,
                anuncio.getDataCriacao(),
                anuncio.isAtivo(),
                (anuncio.getOfertasRecebidas() != null) ?
                        anuncio.getOfertasRecebidas().stream()
                                .map(OfertaResponseDTO::new)
                                .collect(Collectors.toList()) :
                        Collections.emptyList()
        );
    }
}