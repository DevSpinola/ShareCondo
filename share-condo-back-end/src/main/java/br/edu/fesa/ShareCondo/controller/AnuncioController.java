package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.*;
import br.edu.fesa.ShareCondo.repositories.AnuncioRepository;
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
@RequestMapping("/anuncios")
public class AnuncioController {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private static final int MAX_ACTIVE_ANNOUNCEMENTS_PER_USER = 5;

    @PostMapping
    @Transactional
    public ResponseEntity<?> criarAnuncio(@RequestBody AnuncioRequestDTO anuncioRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario anunciante = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (anunciante == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado ou não encontrado.");
        }
        if (anunciante.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sua conta precisa ser aprovada para criar anúncios.");
        }
        if (anunciante.getCondominio() == null && anunciante.getTipoUsuario() != TipoUsuario.ADMIN) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário não associado a um condomínio.");
        }

        // Limite de anúncios para USUARIO normal
        if (anunciante.getTipoUsuario() == TipoUsuario.USUARIO) {
            long activeAnnouncementsCount = anuncioRepository.countByAnuncianteIdAndAtivo(anunciante.getId(), true);
            if (activeAnnouncementsCount >= MAX_ACTIVE_ANNOUNCEMENTS_PER_USER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Você atingiu o limite máximo de " + MAX_ACTIVE_ANNOUNCEMENTS_PER_USER + " anúncios ativos.");
            }
        }

        Anuncio novoAnuncio = new Anuncio();
        novoAnuncio.setTitulo(anuncioRequestDTO.titulo());
        novoAnuncio.setDescricao(anuncioRequestDTO.descricao());
        novoAnuncio.setTipoAnuncio(anuncioRequestDTO.tipoAnuncio());
        novoAnuncio.setAnunciante(anunciante);
        novoAnuncio.setDataCriacao(LocalDateTime.now());
        novoAnuncio.setAtivo(anuncioRequestDTO.ativo() != null ? anuncioRequestDTO.ativo() : true);

        Anuncio anuncioSalvo = anuncioRepository.save(novoAnuncio);
        return new ResponseEntity<>(new AnuncioResponseDTO(anuncioSalvo), HttpStatus.CREATED);
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AnuncioResponseDTO>> listarAnuncios() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(List.of());
        }
        if (usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(List.of());
        }


        List<Anuncio> anunciosFiltrados;
        if (usuarioLogado.getTipoUsuario() == TipoUsuario.ADMIN) {
            anunciosFiltrados = anuncioRepository.findAll();
        } else {
            if (usuarioLogado.getCondominio() == null) {
                return ResponseEntity.ok(List.of());
            }
            String condominioIdDoUsuario = usuarioLogado.getCondominio().getId();
            anunciosFiltrados = anuncioRepository.findAll().stream()
                    .filter(anuncio -> anuncio.getAnunciante() != null &&
                            anuncio.getAnunciante().getCondominio() != null &&
                            anuncio.getAnunciante().getCondominio().getId().equals(condominioIdDoUsuario))
                    .collect(Collectors.toList());
        }

        List<AnuncioResponseDTO> dtos = anunciosFiltrados.stream()
                .map(AnuncioResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> buscarAnuncioPorId(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return anuncioRepository.findById(id)
                .map(anuncio -> {
                    if (usuarioLogado.getTipoUsuario() != TipoUsuario.ADMIN) {
                        if (anuncio.getAnunciante() == null || anuncio.getAnunciante().getCondominio() == null ||
                                usuarioLogado.getCondominio() == null ||
                                !anuncio.getAnunciante().getCondominio().getId().equals(usuarioLogado.getCondominio().getId())) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para ver este anúncio.");
                        }
                    }
                    return ResponseEntity.ok(new AnuncioResponseDTO(anuncio));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> atualizarAnuncio(@PathVariable String id, @RequestBody AnuncioRequestDTO anuncioRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null || usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autorizado ou não aprovado.");
        }

        return anuncioRepository.findById(id)
                .map(anuncioExistente -> {
                    boolean isOwner = anuncioExistente.getAnunciante().getId().equals(usuarioLogado.getId());
                    boolean isAdmin = usuarioLogado.getTipoUsuario() == TipoUsuario.ADMIN;
                    boolean isSindicoDoCondominio = false;
                    if (usuarioLogado.getTipoUsuario() == TipoUsuario.SINDICO &&
                            anuncioExistente.getAnunciante().getCondominio() != null &&
                            usuarioLogado.getCondominio() != null &&
                            anuncioExistente.getAnunciante().getCondominio().getId().equals(usuarioLogado.getCondominio().getId())) {
                        isSindicoDoCondominio = true;
                    }

                    if (!isOwner && !isAdmin && !isSindicoDoCondominio) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não autorizado a modificar este anúncio.");
                    }

                    // Se for apenas uma desativação por um síndico que não é o dono, só permitir alterar 'ativo'
                    if (isSindicoDoCondominio && !isOwner && anuncioRequestDTO.ativo() != null && !anuncioRequestDTO.ativo()) {
                        if (anuncioRequestDTO.titulo() != null && !anuncioRequestDTO.titulo().equals(anuncioExistente.getTitulo()) ||
                                anuncioRequestDTO.descricao() != null && !anuncioRequestDTO.descricao().equals(anuncioExistente.getDescricao()) ||
                                anuncioRequestDTO.tipoAnuncio() != null && !anuncioRequestDTO.tipoAnuncio().equals(anuncioExistente.getTipoAnuncio())) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Síndico pode apenas desativar anúncios de seu condomínio, não alterar outros dados.");
                        }
                    }


                    // Se o usuário (não admin/síndico) estiver tentando ATIVAR um anúncio, verificar o limite
                    if (usuarioLogado.getTipoUsuario() == TipoUsuario.USUARIO && isOwner &&
                            Boolean.TRUE.equals(anuncioRequestDTO.ativo()) && !anuncioExistente.isAtivo()) {
                        long activeAnnouncementsCount = anuncioRepository.countByAnuncianteIdAndAtivo(usuarioLogado.getId(), true);
                        if (activeAnnouncementsCount >= MAX_ACTIVE_ANNOUNCEMENTS_PER_USER) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body("Você atingiu o limite máximo de " + MAX_ACTIVE_ANNOUNCEMENTS_PER_USER + " anúncios ativos. Não é possível reativar este anúncio.");
                        }
                    }

                    // Apenas owner e admin podem mudar todos os campos. Síndico pode mudar 'ativo'.
                    if (isOwner || isAdmin) {
                        anuncioExistente.setTitulo(anuncioRequestDTO.titulo());
                        anuncioExistente.setDescricao(anuncioRequestDTO.descricao());
                        anuncioExistente.setTipoAnuncio(anuncioRequestDTO.tipoAnuncio());
                    }

                    if (anuncioRequestDTO.ativo() != null) {
                        // Dono, Admin ou Sindico do mesmo condomínio podem alterar o status 'ativo'
                        anuncioExistente.setAtivo(anuncioRequestDTO.ativo());
                    }


                    Anuncio anuncioSalvo = anuncioRepository.save(anuncioExistente);
                    return ResponseEntity.ok(new AnuncioResponseDTO(anuncioSalvo));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarAnuncio(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null || usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autorizado ou não aprovado.");
        }


        return anuncioRepository.findById(id)
                .map(anuncio -> {
                    boolean isOwner = anuncio.getAnunciante().getId().equals(usuarioLogado.getId());
                    boolean isAdmin = usuarioLogado.getTipoUsuario() == TipoUsuario.ADMIN;
                    boolean isSindicoDoCondominio = false;
                    if (usuarioLogado.getTipoUsuario() == TipoUsuario.SINDICO &&
                            anuncio.getAnunciante().getCondominio() != null &&
                            usuarioLogado.getCondominio() != null &&
                            anuncio.getAnunciante().getCondominio().getId().equals(usuarioLogado.getCondominio().getId())) {
                        isSindicoDoCondominio = true;
                    }

                    if (!isOwner && !isAdmin && !isSindicoDoCondominio) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não autorizado a deletar este anúncio.");
                    }
                    anuncioRepository.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/meus")
    @Transactional(readOnly = true)
    public ResponseEntity<?> listarAnunciosDoUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(authentication.getName());

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        if (usuarioLogado.getStatusUsuario() != StatusUsuario.APROVADO) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sua conta precisa ser aprovada para ver seus anúncios.");
        }

        List<Anuncio> anunciosDoUsuario = anuncioRepository.findByAnuncianteId(usuarioLogado.getId());
        List<AnuncioResponseDTO> dtos = anunciosDoUsuario.stream()
                .map(AnuncioResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}