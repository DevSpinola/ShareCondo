package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.*;
import br.edu.fesa.ShareCondo.repositories.AnuncioRepository;
import br.edu.fesa.ShareCondo.repositories.OfertaRepository;
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ofertas")
public class OfertaController {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/anuncio/{anuncioId}")
    @Transactional
    public ResponseEntity<?> criarOferta(@PathVariable String anuncioId, @RequestBody OfertaRequestDTO ofertaRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        String userEmail = authentication.getName();
        Usuario ofertante = (Usuario) usuarioRepository.findByEmail(userEmail);

        if (ofertante == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário ofertante não encontrado.");
        }

        return anuncioRepository.findById(anuncioId).map(anuncio -> {
            if (!anuncio.isAtivo()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este anúncio não está mais ativo.");
            }
            if (anuncio.getAnunciante().getId().equals(ofertante.getId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Você não pode fazer uma oferta no seu próprio anúncio.");
            }

            Oferta novaOferta = new Oferta();
            novaOferta.setAnuncio(anuncio);
            novaOferta.setOfertante(ofertante);
            novaOferta.setTipoOferta(ofertaRequestDTO.tipoOferta());
            novaOferta.setValor(ofertaRequestDTO.valor());
            novaOferta.setDescricao(ofertaRequestDTO.descricao());
            novaOferta.setDataOferta(LocalDateTime.now());
            novaOferta.setStatus(StatusOferta.PENDENTE);

            Oferta ofertaSalva = ofertaRepository.save(novaOferta);
            return new ResponseEntity<>(new OfertaResponseDTO(ofertaSalva), HttpStatus.CREATED);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Anúncio com ID " + anuncioId + " não encontrado."));
    }

    @GetMapping("/anuncio/{anuncioId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> listarOfertasPorAnuncio(@PathVariable String anuncioId) {
        if (!anuncioRepository.existsById(anuncioId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Anúncio com ID " + anuncioId + " não encontrado.");
        }
        List<OfertaResponseDTO> dtos = ofertaRepository.findByAnuncioId(anuncioId).stream()
                .map(OfertaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/usuario/{usuarioId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> listarOfertasPorUsuario(@PathVariable String usuarioId) {
        if (usuarioRepository.findById(usuarioId).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário com ID " + usuarioId + " não encontrado.");
        }
        List<OfertaResponseDTO> dtos = ofertaRepository.findByOfertanteId(usuarioId).stream()
                .map(OfertaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<OfertaResponseDTO> buscarOfertaPorId(@PathVariable String id) {
        return ofertaRepository.findById(id)
                .map(oferta -> ResponseEntity.ok(new OfertaResponseDTO(oferta)))
                .orElse(ResponseEntity.notFound().build());
    }

    // NOVO MÉTODO: Aceitar Oferta
    @PatchMapping("/{ofertaId}/aceitar")
    @Transactional
    public ResponseEntity<?> aceitarOferta(@PathVariable String ofertaId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(userEmail);

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        return ofertaRepository.findById(ofertaId)
                .map(oferta -> {
                    Anuncio anuncio = oferta.getAnuncio();
                    if (!anuncio.getAnunciante().getId().equals(usuarioLogado.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o anunciante pode aceitar ofertas.");
                    }
                    if (!anuncio.isAtivo()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este anúncio não está mais ativo.");
                    }
                    if (oferta.getStatus() != StatusOferta.PENDENTE) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esta oferta não está mais pendente.");
                    }

                    // Mudar status da oferta para ACEITA
                    oferta.setStatus(StatusOferta.ACEITA);
                    ofertaRepository.save(oferta);

                    // Desativar o anúncio
                    anuncio.setAtivo(false);
                    anuncioRepository.save(anuncio);

                    // Opcional: Recusar automaticamente outras ofertas pendentes para este anúncio
                    anuncio.getOfertasRecebidas().stream()
                            .filter(o -> !o.getId().equals(ofertaId) && o.getStatus() == StatusOferta.PENDENTE)
                            .forEach(outraOferta -> {
                                outraOferta.setStatus(StatusOferta.RECUSADA);
                                ofertaRepository.save(outraOferta);
                            });

                    return ResponseEntity.ok(new OfertaResponseDTO(oferta));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Oferta não encontrada."));
    }

    // NOVO MÉTODO: Recusar Oferta
    @PatchMapping("/{ofertaId}/recusar")
    @Transactional
    public ResponseEntity<?> recusarOferta(@PathVariable String ofertaId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(userEmail);

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        return ofertaRepository.findById(ofertaId)
                .map(oferta -> {
                    Anuncio anuncio = oferta.getAnuncio();
                    // Verifica se o usuário logado é o anunciante
                    if (!anuncio.getAnunciante().getId().equals(usuarioLogado.getId())) {
                        // Ou se o usuário logado é o ofertante (para permitir cancelar a própria oferta)
                        // if (!oferta.getOfertante().getId().equals(usuarioLogado.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o anunciante pode recusar ofertas. (Ou o ofertante pode cancelar - lógica a ser implementada)");
                        // }
                    }
                    if (!anuncio.isAtivo() && oferta.getStatus() != StatusOferta.PENDENTE) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não é possível alterar o status desta oferta pois o anúncio não está ativo ou a oferta não está pendente.");
                    }
                    if (oferta.getStatus() != StatusOferta.PENDENTE) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esta oferta não está mais pendente.");
                    }


                    oferta.setStatus(StatusOferta.RECUSADA);
                    ofertaRepository.save(oferta);
                    return ResponseEntity.ok(new OfertaResponseDTO(oferta));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Oferta não encontrada."));
    }
}