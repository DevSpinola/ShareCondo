package br.edu.fesa.ShareCondo.controller;

import br.edu.fesa.ShareCondo.model.DashboardStatsDTO;
import br.edu.fesa.ShareCondo.model.StatusOferta;
import br.edu.fesa.ShareCondo.model.StatusUsuario;
import br.edu.fesa.ShareCondo.repositories.AnuncioRepository;
import br.edu.fesa.ShareCondo.repositories.CondominioRepository;
import br.edu.fesa.ShareCondo.repositories.OfertaRepository;
import br.edu.fesa.ShareCondo.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CondominioRepository condominioRepository;

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

    @GetMapping("/stats")
    // A autorização é feita via SecurityConfiguration para /dashboard/**
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        long totalUsuarios = usuarioRepository.count();
        long usuariosPendentes = usuarioRepository.countByStatusUsuario(StatusUsuario.PENDENTE_APROVACAO);
        long totalCondominios = condominioRepository.count();
        long totalAnuncios = anuncioRepository.count();
        long anunciosAtivos = anuncioRepository.countByAtivo(true); // Usando o método que já existia
        long totalOfertas = ofertaRepository.count();
        long ofertasPendentes = ofertaRepository.countByStatus(StatusOferta.PENDENTE);

        DashboardStatsDTO stats = new DashboardStatsDTO(
                totalUsuarios,
                usuariosPendentes,
                totalCondominios,
                totalAnuncios,
                anunciosAtivos,
                totalOfertas,
                ofertasPendentes
        );
        return ResponseEntity.ok(stats);
    }
}