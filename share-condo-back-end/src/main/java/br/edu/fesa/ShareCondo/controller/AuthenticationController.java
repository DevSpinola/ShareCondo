package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.infra.security.TokenService;
import br.edu.fesa.ShareCondo.model.*;
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;


    @PostMapping("/login")
    public ResponseEntity login(@RequestBody AuthenticationDTO data) {
        // Aqui você pode implementar a lógica de autenticação
        // Por exemplo, verificar o email e a senha no banco de dados
        // Se a autenticação for bem-sucedida, você pode retornar um token JWT ou outra resposta apropriada
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        Usuario usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.generateToken(usuario);
        var usuarioDTO = new UsuarioDTO(usuario);
        return ResponseEntity.ok(new LoginResponseDTO(token, usuarioDTO));

    }
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterDTO data) {
        System.out.println("Cadastro de usuário: " + data.email());
        if(this.usuarioRepository.findByEmail(data.email()) != null) {
            return ResponseEntity.badRequest().body("Usuário já existe com este e-mail.");
        }
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.senha());
        Usuario usuario = new Usuario(data.email(), data.nome(), encryptedPassword, data.tipoUsuario());

        this.usuarioRepository.save(usuario);

        return ResponseEntity.ok().build();
    }
}
