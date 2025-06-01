package br.edu.fesa.ShareCondo.model;

public record DashboardStatsDTO(
        long totalUsuarios,
        long usuariosPendentes,
        long totalCondominios,
        long totalAnuncios,
        long anunciosAtivos,
        long totalOfertas,
        long ofertasPendentes
) {}