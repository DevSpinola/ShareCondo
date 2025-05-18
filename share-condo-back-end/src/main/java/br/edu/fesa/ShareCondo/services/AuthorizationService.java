package br.edu.fesa.ShareCondo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    UsuarioRepository usuarioRepository;
    // Implement the loadUserByUsername method to load user details from the database
    @Override
    public UserDetails loadUserByUsername(String username) {
        // Implement your logic to load user by username
        return usuarioRepository.findByEmail(username);
    }
}
