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

                        // Usuários (CRUD - exemplo, pode precisar de mais granularidade)
                        .requestMatchers(HttpMethod.GET, "/usuario/**").authenticated() // Permitir buscar usuários se autenticado
                        .requestMatchers(HttpMethod.PUT, "/usuario/**").authenticated() // Permitir atualizar usuário se autenticado
                        .requestMatchers(HttpMethod.PATCH, "/usuario/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/usuario/**").hasRole("ADMIN") // Só admin deleta usuário

                        // Condomínios (Exemplo: ADMIN gerencia, usuários podem listar/ver)
                        .requestMatchers(HttpMethod.POST, "/condominio").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/condominio/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/condominio/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/condominio/**").permitAll() // Permitir listagem para todos

                        // Anúncios
                        .requestMatchers(HttpMethod.POST, "/anuncios").authenticated() // Usuários autenticados podem criar
                        .requestMatchers(HttpMethod.PUT, "/anuncios/**").authenticated() // Edição/deleção controlada no controller
                        .requestMatchers(HttpMethod.DELETE, "/anuncios/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/anuncios/**").permitAll() // Permitir visualização para todos

                        // Ofertas
                        .requestMatchers(HttpMethod.POST, "/ofertas/**").authenticated() // Usuários autenticados podem fazer ofertas
                        .requestMatchers(HttpMethod.PUT, "/ofertas/**").authenticated() // Atualização de status, etc.
                        .requestMatchers(HttpMethod.GET, "/ofertas/**").authenticated() // Ver ofertas

                        // .requestMatchers(HttpMethod.POST, "/classificados").hasRole("ADMIN") // Regra anterior, ajuste se "classificados" for "anuncios"
                        .anyRequest().authenticated() // Qualquer outra requisição precisa de autenticação
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