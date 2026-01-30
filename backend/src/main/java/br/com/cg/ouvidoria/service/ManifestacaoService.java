package br.com.cg.ouvidoria.service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.repository.ManifestacaoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManifestacaoService {

    private final ManifestacaoRepository repository;
    private final FileService fileService;

    public Manifestacao criar(Manifestacao manifestacao) {
        manifestacao.setProtocolo(gerarProtocolo());
        return repository.save(manifestacao);
    }

    public Optional<Manifestacao> buscarPorProtocolo(String protocolo) {
        return repository.findByProtocolo(protocolo);
    }

    /**
     * Salva a manifestação junto com os arquivos de mídia (áudio, imagem, vídeo).
     * Cada arquivo é persistido no disco e sua URL é armazenada na entidade.
     */
    public Manifestacao salvarManifestacaoComArquivos(Manifestacao m, MultipartFile audio, MultipartFile imagem, MultipartFile video) {
        m.setProtocolo(gerarProtocolo());

        if (audio != null && !audio.isEmpty()) m.setAnexoAudioUrl(fileService.salvar(audio));
        if (imagem != null && !imagem.isEmpty()) m.setAnexoImagemUrl(fileService.salvar(imagem));
        if (video != null && !video.isEmpty()) m.setAnexoVideoUrl(fileService.salvar(video));

        return repository.save(m);
    }

    /** Gera protocolo no formato PROT-AAAA + 6 dígitos aleatórios */
    private String gerarProtocolo() {
        return "PROT-" + LocalDate.now().getYear() + String.format("%06d", new Random().nextInt(999999));
    }
}
