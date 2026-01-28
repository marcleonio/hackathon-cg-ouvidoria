package br.com.cg.ouvidoria.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.cg.ouvidoria.model.entity.Manifestacao;

@Repository
public interface ManifestacaoRepository extends JpaRepository<Manifestacao, Long> {
    // O Spring Data JPA cria a query automaticamente por causa do nome do método
    Optional<Manifestacao> findByProtocolo(String protocolo);
}
