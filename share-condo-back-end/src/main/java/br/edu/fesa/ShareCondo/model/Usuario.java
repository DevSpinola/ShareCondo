package br.edu.fesa.ShareCondo.model;

import jakarta.persistence.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList; // Importar ArrayList
import java.util.List;
import java.util.Collection;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String nome;
    @Column(unique = true) // Garantir que o email seja único
    private String email;
    private String senha;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;

    @ManyToOne(fetch = FetchType.EAGER) // EAGER pode ser útil para obter o condomínio junto com o usuário
    @JoinColumn(name = "condominio_id")
    private Condominio condominio;

    @Enumerated(EnumType.STRING)
    private StatusUsuario statusUsuario; // PENDENTE_APROVACAO, APROVADO, REJEITADO

    public Usuario() {
        this.statusUsuario = StatusUsuario.PENDENTE_APROVACAO; // Default para novos usuários
    }

    public Usuario(String email, String nome, String senha, TipoUsuario tipoUsuario, Condominio condominio) {
        this.email = email;
        this.nome = nome;
        this.senha = senha;
        this.tipoUsuario = tipoUsuario;
        this.condominio = condominio;
        if (tipoUsuario == TipoUsuario.ADMIN || tipoUsuario == TipoUsuario.SINDICO) {
            this.statusUsuario = StatusUsuario.APROVADO; // Admins e Síndicos são aprovados automaticamente
        } else {
            this.statusUsuario = StatusUsuario.PENDENTE_APROVACAO;
        }
    }

    // Getters e Setters para condominio e statusUsuario
    public Condominio getCondominio() {
        return condominio;
    }

    public void setCondominio(Condominio condominio) {
        this.condominio = condominio;
    }

    public StatusUsuario getStatusUsuario() {
        return statusUsuario;
    }

    public void setStatusUsuario(StatusUsuario statusUsuario) {
        this.statusUsuario = statusUsuario;
    }

    // ... (restante dos getters e setters existentes: id, nome, email, senha, tipoUsuario)
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


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // Todo usuário é USER

        if (this.tipoUsuario == TipoUsuario.ADMIN) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else if (this.tipoUsuario == TipoUsuario.SINDICO) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SINDICO"));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Poderia ser usado para bloquear contas rejeitadas ou pendentes de aprovação
        // return this.statusUsuario == StatusUsuario.APROVADO;
        return true; // Simplificado por enquanto
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Apenas usuários aprovados são considerados habilitados para funcionalidades completas
        return this.statusUsuario == StatusUsuario.APROVADO;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id='" + id + '\'' +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", tipoUsuario=" + tipoUsuario +
                ", condominio=" + (condominio != null ? condominio.getNome() : "N/A") +
                ", statusUsuario=" + statusUsuario +
                '}';
    }
}