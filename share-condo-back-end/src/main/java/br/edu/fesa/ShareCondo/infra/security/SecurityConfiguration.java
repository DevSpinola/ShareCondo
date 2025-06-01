package br.edu.fesa.ShareCondo.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // Certifique-se que sua CorsConfig está funcionando
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Autenticação
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()

                        // Usuários
                        .requestMatchers(HttpMethod.GET, "/usuario/pendentes").hasAnyRole("SINDICO", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/usuario/{id}/aprovar").hasAnyRole("SINDICO", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/usuario/{id}/rejeitar").hasAnyRole("SINDICO", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/usuario/{id}").authenticated() // Permitir que o próprio usuário veja seus dados
                        .requestMatchers(HttpMethod.GET, "/usuario").hasRole("ADMIN") // Listar todos apenas para ADMIN
                        .requestMatchers(HttpMethod.PUT, "/usuario/**").authenticated() // Regras mais finas no controller
                        .requestMatchers(HttpMethod.PATCH, "/usuario/**").authenticated() // Regras mais finas no controller
                        .requestMatchers(HttpMethod.DELETE, "/usuario/**").hasRole("ADMIN")


                        // Condomínios
                        .requestMatchers(HttpMethod.POST, "/condominio").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/condominio/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/condominio/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/condominio/**").permitAll() // Permitir listar para cadastro

                        // Anúncios
                        .requestMatchers(HttpMethod.POST, "/anuncios").hasRole("USER") // ROLE_USER é adicionada a todos autenticados
                        .requestMatchers(HttpMethod.GET, "/anuncios/meus").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/anuncios/**").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/anuncios/**").hasRole("USER") // Ou regras mais finas no controller
                        .requestMatchers(HttpMethod.GET, "/anuncios/**").hasRole("USER") // Filtrado no controller por condomínio

                        // Ofertas
                        .requestMatchers(HttpMethod.POST, "/ofertas/**").hasRole("USER")
                        .requestMatchers(HttpMethod.PATCH, "/ofertas/{ofertaId}/aceitar").hasRole("USER") // Dono do anúncio
                        .requestMatchers(HttpMethod.PATCH, "/ofertas/{ofertaId}/recusar").hasRole("USER") // Dono do anúncio
                        .requestMatchers(HttpMethod.GET, "/ofertas/**").hasRole("USER") // Filtrado no controller

                        .anyRequest().authenticated() // Outras requisições precisam de autenticação
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}