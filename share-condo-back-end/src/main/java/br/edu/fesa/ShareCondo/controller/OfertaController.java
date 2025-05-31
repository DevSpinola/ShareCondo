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
import org.springframework.transaction.annotation.Transactional; // Importante para lazy loading
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
            novaOferta.setStatus(StatusOferta.PENDENTE); // Default status

            Oferta ofertaSalva = ofertaRepository.save(novaOferta);
            return new ResponseEntity<>(new OfertaResponseDTO(ofertaSalva), HttpStatus.CREATED);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Anúncio com ID " + anuncioId + " não encontrado."));
    }

    @GetMapping("/anuncio/{anuncioId}")
    @Transactional(readOnly = true) // Para lazy loading do ofertante
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
    @Transactional(readOnly = true) // Para lazy loading do ofertante e anúncio (ID apenas no DTO)
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
    @Transactional(readOnly = true) // Para lazy loading
    public ResponseEntity<OfertaResponseDTO> buscarOfertaPorId(@PathVariable String id) {
        return ofertaRepository.findById(id)
                .map(oferta -> ResponseEntity.ok(new OfertaResponseDTO(oferta)))
                .orElse(ResponseEntity.notFound().build());
    }
}