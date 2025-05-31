package br.edu.fesa.ShareCondo.model;

import jakarta.persistence.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Collection;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    //make a user class
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String nome;
    private String email;
    private String senha;
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario; //admin ou usuario comum

    public Usuario() {
    }

    public Usuario(String email, String nome, String senha, TipoUsuario tipoUsuario) {
        this.email = email;
        this.nome = nome;
        this.senha = senha;
        this.tipoUsuario = tipoUsuario;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", senha='" + senha + '\'' +
                ", tipoUsuario='" + tipoUsuario + '\'' +
                '}';
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    // Implementação dos métodos da interface UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.tipoUsuario == TipoUsuario.ADMIN) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"),
                           new SimpleGrantedAuthority("ROLE_USER"));
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }

    }
    @Override
    public String getPassword() {
        return senha; // Retorne a senha do usuário
    }
    @Override
    public String getUsername() {
        return email; // Retorne o nome de usuário (ou email) do usuário
    }
    @Override
    public boolean isAccountNonExpired() {
        return true; // Retorne true se a conta não estiver expirada
    }
    @Override
    public boolean isAccountNonLocked() {
        return true; // Retorne true se a conta não estiver bloqueada
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Retorne true se as credenciais não estiverem expiradas
    }
    @Override
    public boolean isEnabled() {
        return true; // Retorne true se o usuário estiver habilitado
    }
}
