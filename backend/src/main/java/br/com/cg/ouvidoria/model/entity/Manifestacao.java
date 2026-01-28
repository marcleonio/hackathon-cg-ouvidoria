package br.com.cg.ouvidoria.model.entity;

import java.time.LocalDateTime;

import br.com.cg.ouvidoria.constants.TipoManifestacaoEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Entity
@Data
public class Manifestacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String protocolo;

    @Enumerated(EnumType.STRING)
    private TipoManifestacaoEnum tipo; // RECLAMACAO, DENUNCIA, SUGESTAO, ELOGIO

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private boolean anonimo;

    // Dados do solicitante (opcionais se for anônimo)
    private String nomeCidadao;
    private String emailCidadao;

    // Caminhos para os arquivos (Storage)
    private String anexoVideoUrl;
    private String anexoAudioUrl;
    private String anexoImagemUrl;

    private LocalDateTime dataCriacao;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
    }
}
