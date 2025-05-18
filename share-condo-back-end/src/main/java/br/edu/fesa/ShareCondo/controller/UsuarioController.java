package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.Usuario;
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("")
    public ResponseEntity<Iterable<Usuario>> listarUsuarios() {
        Iterable<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable String id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuarioById(@PathVariable String id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable String id, @RequestBody Usuario usuario) {
        if (usuarioRepository.existsById(id)) {
            usuario.setId(id);

            // Verifica se a senha foi enviada e criptografa antes de salvar
            if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
                String encryptedPassword = new BCryptPasswordEncoder().encode(usuario.getSenha());
                usuario.setSenha(encryptedPassword);
            }

            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(updatedUsuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuarioParcial(@PathVariable String id, @RequestBody Usuario usuario) {
        if (usuarioRepository.existsById(id)) {
            Usuario existingUsuario = usuarioRepository.findById(id).orElse(null);
            if (existingUsuario != null) {
                if (usuario.getNome() != null) {
                    existingUsuario.setNome(usuario.getNome());
                }
                if (usuario.getEmail() != null) {
                    existingUsuario.setEmail(usuario.getEmail());
                }
                if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
                    String encryptedPassword = new BCryptPasswordEncoder().encode(usuario.getSenha());
                    existingUsuario.setSenha(encryptedPassword);
                }
                if (usuario.getTipoUsuario() != null) {
                    existingUsuario.setTipoUsuario(usuario.getTipoUsuario());
                }
                // Adicione outros campos que você deseja atualizar
                Usuario updatedUsuario = usuarioRepository.save(existingUsuario);
                return ResponseEntity.ok(updatedUsuario);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
