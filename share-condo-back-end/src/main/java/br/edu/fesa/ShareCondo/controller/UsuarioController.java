package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.StatusUsuario;
import br.edu.fesa.ShareCondo.model.TipoUsuario;
import br.edu.fesa.ShareCondo.model.Usuario;
import br.edu.fesa.ShareCondo.model.UsuarioDTO;
// import br.edu.fesa.ShareCondo.repositories.CondominioRepository; // Descomente se necessário
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional; // Importar Optional
import java.util.stream.Collectors;

@RestController
@RequestMapping("usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // @Autowired
    // private CondominioRepository condominioRepository; // Descomente se for usar

    @GetMapping("")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioDTO> dtos = usuarios.stream()
                .map(UsuarioDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable String id) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        return usuarioOptional.map(usuario -> ResponseEntity.ok(new UsuarioDTO(usuario)))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Alterado para ser explícito
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<UsuarioDTO>> listarUsuariosPendentes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof Usuario)) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.UNAUTHORIZED);
        }
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        if (usuarioLogado.getTipoUsuario() != TipoUsuario.SINDICO && usuarioLogado.getTipoUsuario() != TipoUsuario.ADMIN) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.FORBIDDEN);
        }

        List<Usuario> usuariosPendentes;
        List<Usuario> todosUsuarios = usuarioRepository.findAll();

        if (usuarioLogado.getTipoUsuario() == TipoUsuario.SINDICO) {
            if (usuarioLogado.getCondominio() == null) {
                return new ResponseEntity<>(Collections.emptyList(), HttpStatus.BAD_REQUEST);
            }
            String condominioIdDoLogado = usuarioLogado.getCondominio().getId();
            usuariosPendentes = todosUsuarios.stream()
                    .filter(u -> u.getCondominio() != null && u.getCondominio().getId().equals(condominioIdDoLogado)
                            && u.getStatusUsuario() == StatusUsuario.PENDENTE_APROVACAO && u.getTipoUsuario() == TipoUsuario.USUARIO)
                    .collect(Collectors.toList());
        } else { // ADMIN
            usuariosPendentes = todosUsuarios.stream()
                    .filter(u -> u.getStatusUsuario() == StatusUsuario.PENDENTE_APROVACAO)
                    .collect(Collectors.toList());
        }

        List<UsuarioDTO> dtos = usuariosPendentes.stream().map(UsuarioDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private ResponseEntity<UsuarioDTO> createErrorResponse(HttpStatus status) {
        return new ResponseEntity<>(null, status);
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<UsuarioDTO> aprovarUsuario(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof Usuario)) {
            return createErrorResponse(HttpStatus.UNAUTHORIZED);
        }
        Usuario adminOuSindicoLogado = (Usuario) authentication.getPrincipal();

        if (adminOuSindicoLogado.getTipoUsuario() != TipoUsuario.SINDICO && adminOuSindicoLogado.getTipoUsuario() != TipoUsuario.ADMIN) {
            return createErrorResponse(HttpStatus.FORBIDDEN);
        }

        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        if (usuarioOptional.isEmpty()) {
            return createErrorResponse(HttpStatus.NOT_FOUND);
        }

        Usuario usuarioParaAprovar = usuarioOptional.get();

        if (adminOuSindicoLogado.getTipoUsuario() == TipoUsuario.SINDICO) {
            if (usuarioParaAprovar.getCondominio() == null || adminOuSindicoLogado.getCondominio() == null ||
                    !usuarioParaAprovar.getCondominio().getId().equals(adminOuSindicoLogado.getCondominio().getId()) ||
                    usuarioParaAprovar.getTipoUsuario() != TipoUsuario.USUARIO ) {
                return createErrorResponse(HttpStatus.FORBIDDEN);
            }
        }
        if(usuarioParaAprovar.getStatusUsuario() != StatusUsuario.PENDENTE_APROVACAO){
            return createErrorResponse(HttpStatus.BAD_REQUEST);
        }
        usuarioParaAprovar.setStatusUsuario(StatusUsuario.APROVADO);
        usuarioRepository.save(usuarioParaAprovar);
        return ResponseEntity.ok(new UsuarioDTO(usuarioParaAprovar));
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<UsuarioDTO> rejeitarUsuario(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof Usuario)) {
            return createErrorResponse(HttpStatus.UNAUTHORIZED); // Usando o helper
        }
        Usuario adminOuSindicoLogado = (Usuario) authentication.getPrincipal();

        if (adminOuSindicoLogado.getTipoUsuario() != TipoUsuario.SINDICO && adminOuSindicoLogado.getTipoUsuario() != TipoUsuario.ADMIN) {
            return createErrorResponse(HttpStatus.FORBIDDEN); // Usando o helper
        }

        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        if (usuarioOptional.isEmpty()) {
            return createErrorResponse(HttpStatus.NOT_FOUND); // Usando o helper
        }

        Usuario usuarioParaRejeitar = usuarioOptional.get();

        if (adminOuSindicoLogado.getTipoUsuario() == TipoUsuario.SINDICO) {
            if (usuarioParaRejeitar.getCondominio() == null || adminOuSindicoLogado.getCondominio() == null ||
                    !usuarioParaRejeitar.getCondominio().getId().equals(adminOuSindicoLogado.getCondominio().getId()) ||
                    usuarioParaRejeitar.getTipoUsuario() != TipoUsuario.USUARIO) {
                return createErrorResponse(HttpStatus.FORBIDDEN); // Usando o helper
            }
        }
        if(usuarioParaRejeitar.getStatusUsuario() != StatusUsuario.PENDENTE_APROVACAO){
            return createErrorResponse(HttpStatus.BAD_REQUEST); // Usando o helper
        }
        usuarioParaRejeitar.setStatusUsuario(StatusUsuario.REJEITADO);
        usuarioRepository.save(usuarioParaRejeitar);
        return ResponseEntity.ok(new UsuarioDTO(usuarioParaRejeitar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuarioById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof Usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        if (usuarioLogado.getTipoUsuario() != TipoUsuario.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizarUsuario(@PathVariable String id, @RequestBody Usuario usuarioInput) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof Usuario)) {
            return createErrorResponse(HttpStatus.UNAUTHORIZED);
        }
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        Optional<Usuario> existingUsuarioOptional = usuarioRepository.findById(id);
        if (existingUsuarioOptional.isEmpty()) {
            return createErrorResponse(HttpStatus.NOT_FOUND);
        }

        Usuario existingUsuario = existingUsuarioOptional.get();

        boolean isOwner = existingUsuario.getId().equals(usuarioLogado.getId());
        boolean isAdmin = usuarioLogado.getTipoUsuario() == TipoUsuario.ADMIN;
        boolean isSindicoModifyingOwnCondoUser = usuarioLogado.getTipoUsuario() == TipoUsuario.SINDICO &&
                existingUsuario.getCondominio() != null &&
                usuarioLogado.getCondominio() != null &&
                existingUsuario.getCondominio().getId().equals(usuarioLogado.getCondominio().getId());

        if (!isOwner && !isAdmin && !isSindicoModifyingOwnCondoUser) {
            return createErrorResponse(HttpStatus.FORBIDDEN);
        }

        if (usuarioInput.getNome() != null) {
            existingUsuario.setNome(usuarioInput.getNome());
        }
        if (usuarioInput.getSenha() != null && !usuarioInput.getSenha().isEmpty()) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(usuarioInput.getSenha());
            existingUsuario.setSenha(encryptedPassword);
        }

        if (isAdmin) {
            if (usuarioInput.getTipoUsuario() != null) {
                existingUsuario.setTipoUsuario(usuarioInput.getTipoUsuario());
            }
            if (usuarioInput.getStatusUsuario() != null) {
                existingUsuario.setStatusUsuario(usuarioInput.getStatusUsuario());
            }
        }
        Usuario updatedUsuario = usuarioRepository.save(existingUsuario);
        return ResponseEntity.ok(new UsuarioDTO(updatedUsuario));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizarUsuarioParcial(@PathVariable String id, @RequestBody Usuario usuarioUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof Usuario)) {
            return createErrorResponse(HttpStatus.UNAUTHORIZED);
        }
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        Optional<Usuario> existingUsuarioOptional = usuarioRepository.findById(id);
        if (existingUsuarioOptional.isEmpty()) {
            return createErrorResponse(HttpStatus.NOT_FOUND);
        }

        Usuario existingUsuario = existingUsuarioOptional.get();

        boolean isOwner = existingUsuario.getId().equals(usuarioLogado.getId());
        boolean isAdmin = usuarioLogado.getTipoUsuario() == TipoUsuario.ADMIN;
        boolean isSindicoModifyingOwnCondoUser = usuarioLogado.getTipoUsuario() == TipoUsuario.SINDICO &&
                existingUsuario.getCondominio() != null &&
                usuarioLogado.getCondominio() != null &&
                existingUsuario.getCondominio().getId().equals(usuarioLogado.getCondominio().getId());

        if (!isOwner && !isAdmin && !isSindicoModifyingOwnCondoUser) {
            return createErrorResponse(HttpStatus.FORBIDDEN);
        }

        if (usuarioUpdate.getNome() != null) {
            existingUsuario.setNome(usuarioUpdate.getNome());
        }
        if (usuarioUpdate.getSenha() != null && !usuarioUpdate.getSenha().isEmpty()) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(usuarioUpdate.getSenha());
            existingUsuario.setSenha(encryptedPassword);
        }

        if (isAdmin) {
            if (usuarioUpdate.getTipoUsuario() != null) {
                existingUsuario.setTipoUsuario(usuarioUpdate.getTipoUsuario());
            }
            if (usuarioUpdate.getStatusUsuario() != null) {
                existingUsuario.setStatusUsuario(usuarioUpdate.getStatusUsuario());
            }
        } else if (isSindicoModifyingOwnCondoUser) {
            if (usuarioUpdate.getStatusUsuario() != null &&
                    (usuarioUpdate.getStatusUsuario() == StatusUsuario.APROVADO || usuarioUpdate.getStatusUsuario() == StatusUsuario.REJEITADO)) {
                if(existingUsuario.getTipoUsuario() == TipoUsuario.USUARIO && existingUsuario.getStatusUsuario() == StatusUsuario.PENDENTE_APROVACAO) {
                    existingUsuario.setStatusUsuario(usuarioUpdate.getStatusUsuario());
                } else {
                    return createErrorResponse(HttpStatus.BAD_REQUEST);
                }
            }
        }
        Usuario updatedUsuario = usuarioRepository.save(existingUsuario);
        return ResponseEntity.ok(new UsuarioDTO(updatedUsuario));
    }
}