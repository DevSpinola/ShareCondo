package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.Anuncio;
import br.edu.fesa.ShareCondo.model.AnuncioRequestDTO;
import br.edu.fesa.ShareCondo.model.AnuncioResponseDTO;
import br.edu.fesa.ShareCondo.model.Usuario;
import br.edu.fesa.ShareCondo.repositories.AnuncioRepository;
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
@RequestMapping("/anuncios")
public class AnuncioController {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @Transactional // Garante que a sessão do Hibernate esteja ativa para o anunciante
    public ResponseEntity<?> criarAnuncio(@RequestBody AnuncioRequestDTO anuncioRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        String userEmail = authentication.getName();
        Usuario anunciante = (Usuario) usuarioRepository.findByEmail(userEmail);

        if (anunciante == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário anunciante não encontrado.");
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
    @Transactional(readOnly = true) // Para lazy loading de ofertas e anunciante
    public ResponseEntity<List<AnuncioResponseDTO>> listarAnuncios() {
        List<AnuncioResponseDTO> dtos = anuncioRepository.findAll().stream()
                .map(AnuncioResponseDTO::new) // O construtor do DTO lidará com o mapeamento
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true) // Para lazy loading de ofertas e anunciante
    public ResponseEntity<AnuncioResponseDTO> buscarAnuncioPorId(@PathVariable String id) {
        return anuncioRepository.findById(id)
                .map(anuncio -> ResponseEntity.ok(new AnuncioResponseDTO(anuncio)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> atualizarAnuncio(@PathVariable String id, @RequestBody AnuncioRequestDTO anuncioRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        String userEmail = authentication.getName();

        return anuncioRepository.findById(id)
                .map(anuncioExistente -> {
                    Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(userEmail);
                    if (usuarioLogado == null ||
                            (!anuncioExistente.getAnunciante().getId().equals(usuarioLogado.getId()) &&
                                    usuarioLogado.getTipoUsuario() != br.edu.fesa.ShareCondo.model.TipoUsuario.ADMIN)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não autorizado a modificar este anúncio.");
                    }

                    anuncioExistente.setTitulo(anuncioRequestDTO.titulo());
                    anuncioExistente.setDescricao(anuncioRequestDTO.descricao());
                    anuncioExistente.setTipoAnuncio(anuncioRequestDTO.tipoAnuncio());
                    if (anuncioRequestDTO.ativo() != null) {
                        anuncioExistente.setAtivo(anuncioRequestDTO.ativo());
                    }
                    Anuncio anuncioSalvo = anuncioRepository.save(anuncioExistente);
                    return ResponseEntity.ok(new AnuncioResponseDTO(anuncioSalvo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // O método delete pode permanecer similar, mas a verificação de autorização deve ser mantida.
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarAnuncio(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        String userEmail = authentication.getName();

        return anuncioRepository.findById(id)
                .map(anuncio -> {
                    Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(userEmail);
                    if (usuarioLogado == null ||
                            (!anuncio.getAnunciante().getId().equals(usuarioLogado.getId()) &&
                                    usuarioLogado.getTipoUsuario() != br.edu.fesa.ShareCondo.model.TipoUsuario.ADMIN)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não autorizado a deletar este anúncio.");
                    }
                    anuncioRepository.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}