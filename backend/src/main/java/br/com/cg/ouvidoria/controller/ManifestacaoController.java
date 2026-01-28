package br.com.cg.ouvidoria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.cg.ouvidoria.constants.TipoManifestacaoEnum;
import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.service.ManifestacaoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manifestacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Libera para o front do seu amigo acessar sem erro de CORS
public class ManifestacaoController {

    private final ManifestacaoService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Manifestacao> criar(
        @RequestParam("descricao") String descricao,
        @RequestParam("tipo") TipoManifestacaoEnum tipo,
        @RequestParam("anonimo") boolean anonimo,
        @RequestParam(value = "nome", required = false) String nome,
        @RequestParam(value = "email", required = false) String email,
        @RequestParam(value = "audio", required = false) MultipartFile audio,
        @RequestParam(value = "imagem", required = false) MultipartFile imagem,
        @RequestParam(value = "video", required = false) MultipartFile video) {

        Manifestacao m = new Manifestacao();
        m.setDescricao(descricao);
        m.setTipo(tipo);
        m.setAnonimo(anonimo);

        // Regra de anonimato
        if (!anonimo) {
            m.setNomeCidadao(nome);
            m.setEmailCidadao(email);
        }

        // Chama o service que vai cuidar de salvar arquivos e persistir no banco
        return ResponseEntity.ok(service.salvarManifestacaoComArquivos(m, audio, imagem, video));
    }

    @GetMapping("/{protocolo}")
    public ResponseEntity<Manifestacao> buscarPorProtocolo(@PathVariable String protocolo) {
        return service.buscarPorProtocolo(protocolo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
