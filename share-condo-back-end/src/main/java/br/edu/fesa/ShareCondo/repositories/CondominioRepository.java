package br.edu.fesa.ShareCondo.repositories;

import br.edu.fesa.ShareCondo.model.Condominio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CondominioRepository extends JpaRepository<Condominio, String> {
}