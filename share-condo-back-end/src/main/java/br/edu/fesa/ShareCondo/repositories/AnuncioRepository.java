package br.edu.fesa.ShareCondo.repositories;

import br.edu.fesa.ShareCondo.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, String> {
    List<Anuncio> findByAnuncianteId(String anuncianteId);
    long countByAnuncianteIdAndAtivo(String anuncianteId, boolean ativo); // <-- NOVO MÉTODO
}