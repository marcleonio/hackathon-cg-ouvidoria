package br.com.cg.ouvidoria.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Random;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.cg.ouvidoria.constants.ProtocoloStatusEnum;
import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.repository.ManifestacaoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManifestacaoService {

    private final ManifestacaoRepository repository;
    private final AnaliseTextoService analiseTextoService;
    private final FileService fileService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Manifestacao salvarSimples(Manifestacao manifestacao) {
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
        String senhaGerada = gerarSenhaAleatoria(); // Ex: "5588"
        m.setSenha(encoder.encode(senhaGerada));
        m.setStatus(ProtocoloStatusEnum.RECEBIDO);m.setPrioridade(analiseTextoService.calcularCriticidade(m.getDescricao()));

        if (audio != null && !audio.isEmpty()) m.setAnexoAudioUrl(fileService.salvar(audio));
        if (imagem != null && !imagem.isEmpty()) m.setAnexoImagemUrl(fileService.salvar(imagem));
        if (video != null && !video.isEmpty()) m.setAnexoVideoUrl(fileService.salvar(video));

        Manifestacao salva = repository.save(m);

        // Devolvemos a senha pura apenas no retorno do POST para o usuário anotar
        salva.setSenha(senhaGerada);
        return salva;
    }

    /** Gera protocolo no formato PROT-AAAA + 6 dígitos aleatórios */
    private String gerarProtocolo() {
        return "PROT-" + LocalDate.now().getYear() + String.format("%06d", new Random().nextInt(999999));
    }

    private String gerarSenhaAleatoria() {
        // Gera um PIN de 4 dígitos para ser fácil de anotar/ouviar
        return String.format("%04d", new Random().nextInt(9999));
    }

    public String gerarResumoAcessivel(Manifestacao m) {
        String canal = m.getDescricao() != null && !m.getDescricao().isBlank()
            ? "por texto"
            : m.getAnexoAudioUrl() != null ? "por audio" : "por midia";

        return String.format(
            "Ola! Sua manifestacao do tipo %s, registrada %s, de protocolo %s, em %s, esta com o status atual: %s.",
            m.getTipo().toString().toLowerCase(),
            canal,
            m.getProtocolo(),
            m.getDataCriacao().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            m.getStatus()
        );
    }

    // Método de busca atualizado com a trava da senha
    public Optional<Manifestacao> buscarPorProtocoloESenha(String protocolo, String senhaInformada) {
        return repository.findByProtocolo(protocolo)
                .filter(m -> encoder.matches(senhaInformada, m.getSenha()));
    }

}
