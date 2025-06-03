package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.infra.security.TokenService;
import br.edu.fesa.ShareCondo.model.*;
import br.edu.fesa.ShareCondo.repositories.CondominioRepository; // IMPORTAR
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // IMPORTAR
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.validation.annotation.Validated; // Removido se não usado
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CondominioRepository condominioRepository; // INJETAR

    @Autowired
    private TokenService tokenService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data) { // Alterado para ResponseEntity<?>
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        Usuario usuario = (Usuario) auth.getPrincipal();

        if (usuario.getStatusUsuario() != StatusUsuario.APROVADO && usuario.getTipoUsuario() == TipoUsuario.USUARIO) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sua conta está pendente de aprovação ou foi rejeitada.");
        }

        var token = tokenService.generateToken(usuario);
        var usuarioDTO = new UsuarioDTO(usuario);
        return ResponseEntity.ok(new LoginResponseDTO(token, usuarioDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO data) { // Alterado para ResponseEntity<?>
        if (this.usuarioRepository.findByEmail(data.email()) != null) {
            return ResponseEntity.badRequest().body("Usuário já existe com este e-mail.");
        }

        Condominio condominio = null;
        if (data.tipoUsuario() == TipoUsuario.USUARIO || data.tipoUsuario() == TipoUsuario.SINDICO) {
            if (data.condominioId() == null || data.condominioId().isBlank()) {
                return ResponseEntity.badRequest().body("Condomínio é obrigatório para usuários e síndicos.");
            }
            condominio = condominioRepository.findById(data.condominioId())
                    .orElse(null);
            if (condominio == null) {
                return ResponseEntity.badRequest().body("Condomínio com ID " + data.condominioId() + " não encontrado.");
            }
        } else if (data.tipoUsuario() == TipoUsuario.ADMIN && data.condominioId() != null) {
            // Admin não precisa estar vinculado a um condomínio específico dessa forma,
            // mas se um ID for passado, pode ser um erro de request.
            // Ou pode-se permitir que um admin também esteja *associado* a um, mas com escopo global.
            // Por simplicidade, admin não tem condomínio obrigatório.
        }


        String encryptedPassword = new BCryptPasswordEncoder().encode(data.senha());
        Usuario usuario = new Usuario(data.email(), data.nome(), encryptedPassword, data.tipoUsuario(), condominio);

        // Status já é definido no construtor de Usuario
        // Se for ADMIN ou SINDICO, o status será APROVADO, senão PENDENTE.
        if (data.tipoUsuario() == TipoUsuario.ADMIN) {
            usuario.setCondominio(null); // Admin não é vinculado a um condomínio específico.
        }


        this.usuarioRepository.save(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado. Aguardando aprovação do síndico se aplicável.");
    }
}