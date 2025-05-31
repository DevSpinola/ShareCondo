package br.edu.fesa.ShareCondo.repositories;

import br.edu.fesa.ShareCondo.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, String> {
}