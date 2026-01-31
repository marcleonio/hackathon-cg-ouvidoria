package br.com.cg.ouvidoria.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.cg.ouvidoria.model.entity.Manifestacao;

@Repository
public interface ManifestacaoRepository extends JpaRepository<Manifestacao, Long> {
    Optional<Manifestacao> findByProtocolo(String protocolo);

    @Query("SELECT m.tipo, COUNT(m) FROM Manifestacao m GROUP BY m.tipo")
    List<Object[]> countByTipo();

    @Query("SELECT m.status, COUNT(m) FROM Manifestacao m GROUP BY m.status")
    List<Object[]> countByStatus();

    long countByAnexoAudioUrlIsNotNull();
    long countByAnexoVideoUrlIsNotNull();
    long countByAnexoImagemUrlIsNotNull();

}
