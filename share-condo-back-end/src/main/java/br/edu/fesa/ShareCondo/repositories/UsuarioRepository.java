package br.edu.fesa.ShareCondo.repositories;

import br.edu.fesa.ShareCondo.model.Usuario;
import br.edu.fesa.ShareCondo.model.StatusUsuario; // IMPORTADO
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    UserDetails findByEmail(String email);
    long countByStatusUsuario(StatusUsuario status); // NOVO MÉTODO
}