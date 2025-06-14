package br.edu.fesa.ShareCondo.repositories;

import br.edu.fesa.ShareCondo.model.Oferta;
import br.edu.fesa.ShareCondo.model.StatusOferta; // IMPORTADO
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, String> {
    List<Oferta> findByAnuncioId(String anuncioId);
    List<Oferta> findByOfertanteId(String ofertanteId);
    long countByStatus(StatusOferta status); // NOVO MÉTODO
}