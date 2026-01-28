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


    public Manifestacao salvarManifestacaoComArquivos(Manifestacao m, MultipartFile audio, MultipartFile imagem, MultipartFile video) {
        // 1. Gera o protocolo
        m.setProtocolo(gerarProtocolo());

        // 2. Salva os arquivos e guarda o caminho/URL na entidade
        if (audio != null && !audio.isEmpty()) m.setAnexoAudioUrl(fileService.salvar(audio));
        if (imagem != null && !imagem.isEmpty()) m.setAnexoImagemUrl(fileService.salvar(imagem));
        if (video != null && !video.isEmpty()) m.setAnexoVideoUrl(fileService.salvar(video));

        // 3. Salva no H2
        return repository.save(m);
    }

    private String gerarProtocolo() {
        return "PROT-" + LocalDate.now().getYear() + String.format("%06d", new Random().nextInt(999999));
    }

}
