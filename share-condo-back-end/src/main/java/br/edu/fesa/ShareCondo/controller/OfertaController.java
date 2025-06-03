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
        Usuario ofertante = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (ofertante == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ofertante não autenticado ou não encontrado.");
        }
        if (ofertante.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sua conta precisa ser aprovada para fazer ofertas.");
        }

        return anuncioRepository.findById(anuncioId).map(anuncio -> {
            if (!anuncio.isAtivo()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este anúncio não está mais ativo.");
            }
            if (anuncio.getAnunciante().getId().equals(ofertante.getId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Você não pode fazer uma oferta no seu próprio anúncio.");
            }

            // Validação de mesmo condomínio
            Usuario anunciante = anuncio.getAnunciante();
            if (ofertante.getTipoUsuario() != TipoUsuario.ADMIN && anunciante.getTipoUsuario() != TipoUsuario.ADMIN) {
                if (ofertante.getCondominio() == null || anunciante.getCondominio() == null ||
                        !ofertante.getCondominio().getId().equals(anunciante.getCondominio().getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Ofertas só podem ser feitas entre membros do mesmo condomínio.");
                }
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

    // ... demais métodos ...
    // Os métodos de listar ofertas, aceitar, recusar, etc., também podem precisar
    // de verificações de status do usuário e pertencimento ao condomínio,
    // dependendo da granularidade desejada.

    @GetMapping("/anuncio/{anuncioId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> listarOfertasPorAnuncio(@PathVariable String anuncioId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null || usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autorizado ou não aprovado.");
        }

        Anuncio anuncio = anuncioRepository.findById(anuncioId).orElse(null);
        if (anuncio == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Anúncio com ID " + anuncioId + " não encontrado.");
        }

        // Se não for ADMIN, e o anúncio não for do condomínio do usuário, não mostrar ofertas.
        if(usuarioLogado.getTipoUsuario() != TipoUsuario.ADMIN) {
            if (anuncio.getAnunciante().getCondominio() == null || usuarioLogado.getCondominio() == null ||
                    !anuncio.getAnunciante().getCondominio().getId().equals(usuarioLogado.getCondominio().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para ver ofertas deste anúncio.");
            }
        }

        List<OfertaResponseDTO> dtos = ofertaRepository.findByAnuncioId(anuncioId).stream()
                .map(OfertaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/usuario/{usuarioId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> listarOfertasPorUsuario(@PathVariable String usuarioId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null || usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autorizado ou não aprovado.");
        }

        // Um usuário só pode ver suas próprias ofertas, ou um ADMIN/SINDICO pode ver ofertas de usuários do seu condomínio
        if (!usuarioLogado.getId().equals(usuarioId) && usuarioLogado.getTipoUsuario() == TipoUsuario.USUARIO) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você só pode ver suas próprias ofertas.");
        }

        Usuario usuarioAlvo = usuarioRepository.findById(usuarioId).orElse(null);
        if (usuarioAlvo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário com ID " + usuarioId + " não encontrado.");
        }

        if(usuarioLogado.getTipoUsuario() == TipoUsuario.SINDICO) {
            if (usuarioAlvo.getCondominio() == null || usuarioLogado.getCondominio() == null ||
                    !usuarioAlvo.getCondominio().getId().equals(usuarioLogado.getCondominio().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Síndico pode ver apenas ofertas de usuários do seu condomínio.");
            }
        }
        // ADMIN pode ver qualquer uma

        List<OfertaResponseDTO> dtos = ofertaRepository.findByOfertanteId(usuarioId).stream()
                .map(OfertaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{ofertaId}/aceitar")
    @Transactional
    public ResponseEntity<?> aceitarOferta(@PathVariable String ofertaId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null || usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado ou não aprovado.");
        }

        // ... (restante da lógica existente, que já verifica se é o anunciante)
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

                    oferta.setStatus(StatusOferta.ACEITA);
                    ofertaRepository.save(oferta);
                    anuncio.setAtivo(false);
                    anuncioRepository.save(anuncio);
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

    @PatchMapping("/{ofertaId}/recusar")
    @Transactional
    public ResponseEntity<?> recusarOferta(@PathVariable String ofertaId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null || usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado ou não aprovado.");
        }
        // ... (restante da lógica existente)
        return ofertaRepository.findById(ofertaId)
                .map(oferta -> {
                    Anuncio anuncio = oferta.getAnuncio();
                    if (!anuncio.getAnunciante().getId().equals(usuarioLogado.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o anunciante pode recusar ofertas.");
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
    // Adicionar GET /ofertas (listar todas as ofertas para Admin, talvez para Síndico do seu condomínio)
    @GetMapping("")
    @Transactional(readOnly = true)
    public ResponseEntity<List<OfertaResponseDTO>> listarTodasOfertas() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null || usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Oferta> ofertas;
        if (usuarioLogado.getTipoUsuario() == TipoUsuario.ADMIN) {
            ofertas = ofertaRepository.findAll();
        } else if (usuarioLogado.getTipoUsuario() == TipoUsuario.SINDICO) {
            if (usuarioLogado.getCondominio() == null) {
                return ResponseEntity.ok(List.of());
            }
            String condominioIdDoSindico = usuarioLogado.getCondominio().getId();
            // Filtra ofertas onde o anunciante OU o ofertante pertencem ao condomínio do síndico
            ofertas = ofertaRepository.findAll().stream()
                    .filter(o -> (o.getAnuncio().getAnunciante().getCondominio() != null && o.getAnuncio().getAnunciante().getCondominio().getId().equals(condominioIdDoSindico)) ||
                            (o.getOfertante().getCondominio() != null && o.getOfertante().getCondominio().getId().equals(condominioIdDoSindico)))
                    .collect(Collectors.toList());
        } else {
            // Usuários comuns não devem acessar este endpoint geral, a menos que seja para suas próprias ofertas (já coberto por /usuario/{id})
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<OfertaResponseDTO> dtos = ofertas.stream().map(OfertaResponseDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

}