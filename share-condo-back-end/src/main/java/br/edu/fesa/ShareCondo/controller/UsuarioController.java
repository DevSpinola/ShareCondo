package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.*; // Importa todos os modelos necessários
import br.edu.fesa.ShareCondo.repositories.CondominioRepository; // IMPORTAR
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired // INJETAR CondominioRepository
    private CondominioRepository condominioRepository;

    // ... (métodos GET, DELETE, aprovar, rejeitar, pendentes permanecem como na última versão)

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
        return usuarioRepository.findById(id)
                .map(usuario -> ResponseEntity.ok(new UsuarioDTO(usuario)))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
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
        Usuario usuarioParaRejeitar = usuarioOptional.get();

        if (adminOuSindicoLogado.getTipoUsuario() == TipoUsuario.SINDICO) {
            if (usuarioParaRejeitar.getCondominio() == null || adminOuSindicoLogado.getCondominio() == null ||
                    !usuarioParaRejeitar.getCondominio().getId().equals(adminOuSindicoLogado.getCondominio().getId()) ||
                    usuarioParaRejeitar.getTipoUsuario() != TipoUsuario.USUARIO) {
                return createErrorResponse(HttpStatus.FORBIDDEN);
            }
        }
        if(usuarioParaRejeitar.getStatusUsuario() != StatusUsuario.PENDENTE_APROVACAO){
            return createErrorResponse(HttpStatus.BAD_REQUEST);
        }
        usuarioParaRejeitar.setStatusUsuario(StatusUsuario.REJEITADO);
        usuarioRepository.save(usuarioParaRejeitar);
        return ResponseEntity.ok(new UsuarioDTO(usuarioParaRejeitar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsuarioById(@PathVariable String id) { // Alterado para ResponseEntity<?>
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof Usuario)) {
            // Retornar um corpo JSON para consistência
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Usuário não autenticado."));
        }
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        if (usuarioLogado.getTipoUsuario() != TipoUsuario.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Apenas administradores podem excluir usuários."));
        }

        if (usuarioLogado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Administradores não podem se auto-excluir."));
        }

        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", "Usuário com ID " + id + " não encontrado."));
        }

        try {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content em caso de sucesso
        } catch (DataIntegrityViolationException e) {
            // Logar o erro no backend para depuração
            System.err.println("Falha ao excluir usuário ID " + id + " devido à violação de integridade de dados: " + e.getMessage());
            // Retornar uma mensagem clara para o frontend
            return ResponseEntity.status(HttpStatus.CONFLICT) // 409 Conflict é apropriado
                    .body(Map.of("erro", "Não é possível excluir o usuário. Existem dados associados a ele (ex: anúncios, ofertas). Por favor, remova ou reatribua esses dados primeiro."));
        } catch (Exception e) { // Captura outras exceções inesperadas
            System.err.println("Erro inesperado ao tentar excluir usuário ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Ocorreu um erro inesperado no servidor ao tentar excluir o usuário."));
        }
    }

    // MÉTODO PUT ATUALIZADO PARA USAR UsuarioUpdateRequestDTO
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizarUsuario(@PathVariable String id, @RequestBody UsuarioUpdateRequestDTO usuarioUpdateDTO) {
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

        // Aplicar todas as atualizações do DTO (PUT geralmente substitui o recurso)
        if (usuarioUpdateDTO.nome() != null) existingUsuario.setNome(usuarioUpdateDTO.nome());
        if (usuarioUpdateDTO.email() != null) {
            // Adicionar validação se o email está sendo alterado para um já existente por outro usuário
            if (!existingUsuario.getEmail().equals(usuarioUpdateDTO.email()) && usuarioRepository.findByEmail(usuarioUpdateDTO.email()) != null) {
                //return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email já em uso por outro usuário."); // Precisa de <UsuarioDTO>
                return createErrorResponse(HttpStatus.BAD_REQUEST); // Simplificado
            }
            existingUsuario.setEmail(usuarioUpdateDTO.email());
        }

        if (usuarioUpdateDTO.senha() != null && !usuarioUpdateDTO.senha().isEmpty()) {
            existingUsuario.setSenha(new BCryptPasswordEncoder().encode(usuarioUpdateDTO.senha()));
        }

        if (isAdmin) { // Admin pode mudar tipo, status e condomínio
            if (usuarioUpdateDTO.tipoUsuario() != null) existingUsuario.setTipoUsuario(usuarioUpdateDTO.tipoUsuario());
            if (usuarioUpdateDTO.statusUsuario() != null) existingUsuario.setStatusUsuario(usuarioUpdateDTO.statusUsuario());

            if (usuarioUpdateDTO.condominioId() != null) {
                if (usuarioUpdateDTO.condominioId().isEmpty()) { // Permitir desassociar
                    existingUsuario.setCondominio(null);
                } else {
                    Condominio condominio = condominioRepository.findById(usuarioUpdateDTO.condominioId()).orElse(null);
                    if (condominio == null && !usuarioUpdateDTO.condominioId().isEmpty()) {
                        //return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Condomínio ID inválido."); // Precisa de <UsuarioDTO>
                        return createErrorResponse(HttpStatus.BAD_REQUEST); // Simplificado
                    }
                    existingUsuario.setCondominio(condominio);
                }
            }
        }
        // Usuário normal não pode mudar seu próprio tipo, status ou condomínio via este endpoint.
        // Síndico poderia ter lógica mais granular se necessário, mas PUT é geralmente para substituição total.

        Usuario updatedUsuario = usuarioRepository.save(existingUsuario);
        return ResponseEntity.ok(new UsuarioDTO(updatedUsuario));
    }

    // MÉTODO PATCH ATUALIZADO PARA USAR UsuarioUpdateRequestDTO
    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizarUsuarioParcial(@PathVariable String id, @RequestBody UsuarioUpdateRequestDTO usuarioUpdateDTO) {
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

        if (usuarioUpdateDTO.nome() != null) {
            existingUsuario.setNome(usuarioUpdateDTO.nome());
        }
        if (usuarioUpdateDTO.email() != null) {
            if (!existingUsuario.getEmail().equals(usuarioUpdateDTO.email()) && usuarioRepository.findByEmail(usuarioUpdateDTO.email()) != null) {
                return createErrorResponse(HttpStatus.BAD_REQUEST); // Email já existe
            }
            existingUsuario.setEmail(usuarioUpdateDTO.email());
        }
        if (usuarioUpdateDTO.senha() != null && !usuarioUpdateDTO.senha().isEmpty()) {
            existingUsuario.setSenha(new BCryptPasswordEncoder().encode(usuarioUpdateDTO.senha()));
        }

        if (isAdmin) { // Admin pode mudar qualquer um destes campos
            if (usuarioUpdateDTO.tipoUsuario() != null) {
                existingUsuario.setTipoUsuario(usuarioUpdateDTO.tipoUsuario());
            }
            if (usuarioUpdateDTO.statusUsuario() != null) {
                existingUsuario.setStatusUsuario(usuarioUpdateDTO.statusUsuario());
            }
            if (usuarioUpdateDTO.condominioId() != null) {
                if (usuarioUpdateDTO.condominioId().isEmpty() || "null".equalsIgnoreCase(usuarioUpdateDTO.condominioId())) {
                    // Permitir Admin desassociar SINDICO ou USUARIO do condominio
                    if(existingUsuario.getTipoUsuario() == TipoUsuario.ADMIN && usuarioUpdateDTO.condominioId() != null && !usuarioUpdateDTO.condominioId().isEmpty()){
                        // Admin não pode ser desassociado se um ID for explicitamente passado (e não for para null/empty)
                        // A menos que queira proibir admin de ter condominio.
                        // Para manter simples, se admin, e condominioId é passado, tentamos associar. Se vazio, remove.
                    }
                    existingUsuario.setCondominio(null);

                } else {
                    Condominio condominio = condominioRepository.findById(usuarioUpdateDTO.condominioId()).orElse(null);
                    if (condominio == null) {
                        return createErrorResponse(HttpStatus.BAD_REQUEST); // Condomínio ID inválido
                    }
                    existingUsuario.setCondominio(condominio);
                }
            }
        } else if (isSindicoModifyingOwnCondoUser && usuarioUpdateDTO.statusUsuario() != null) {
            // Síndico só pode alterar status de usuários (não SINDICO/ADMIN) do seu condomínio para APROVADO/REJEITADO se PENDENTE
            if(existingUsuario.getTipoUsuario() == TipoUsuario.USUARIO && existingUsuario.getStatusUsuario() == StatusUsuario.PENDENTE_APROVACAO &&
                    (usuarioUpdateDTO.statusUsuario() == StatusUsuario.APROVADO || usuarioUpdateDTO.statusUsuario() == StatusUsuario.REJEITADO)) {
                existingUsuario.setStatusUsuario(usuarioUpdateDTO.statusUsuario());
            } else if (existingUsuario.getTipoUsuario() == TipoUsuario.USUARIO && existingUsuario.getId().equals(usuarioLogado.getId())) {
                // Sindico tentando editar a si mesmo (exceto status)
                // Não permitir que síndico altere seu próprio tipo ou condomínio via este patch, apenas nome/senha
            } else if (existingUsuario.getTipoUsuario() == TipoUsuario.USUARIO) {
                // Sindico tentando alterar outros campos de um usuario do seu condominio (que nao seja status pendente)
                // Permitido apenas se isOwner (já tratado) ou isAdmin.
                // Portanto, um síndico não pode, por exemplo, alterar o nome de um usuário aqui, apenas o status de pendente.
            }
            else {
                // Tentativa de SINDICO alterar algo não permitido
                return createErrorResponse(HttpStatus.FORBIDDEN);
            }
        }
        // Usuário comum (isOwner) só pode mudar nome e senha. Tipo, status, condomínio não.

        Usuario updatedUsuario = usuarioRepository.save(existingUsuario);
        return ResponseEntity.ok(new UsuarioDTO(updatedUsuario));
    }
}