package br.com.cg.ouvidoria.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.com.cg.ouvidoria.constants.ProtocoloStatusEnum;
import br.com.cg.ouvidoria.constants.TipoManifestacaoEnum;
import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.service.ManifestacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manifestacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ManifestacaoController {

    private final ManifestacaoService service;

    @Operation(summary = "Registrar nova manifestação",
               description = "Cria uma manifestação com suporte a arquivos de áudio, vídeo e imagem para acessibilidade.")
    @ApiResponse(responseCode = "200", description = "Manifestação criada com sucesso")
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

        if (!anonimo) {
            m.setNomeCidadao(nome);
            m.setEmailCidadao(email);
        }

        return ResponseEntity.ok(service.salvarManifestacaoComArquivos(m, audio, imagem, video));
    }

    @Operation(summary = "Consultar manifestação", description = "Busca detalhes de uma manifestação via protocolo e senha.")
    @ApiResponse(responseCode = "200", description = "Manifestação encontrada")
    @GetMapping("/{protocolo}")
    public ResponseEntity<?> buscar(
            @PathVariable String protocolo,
            @RequestParam("senha") String senha) {

        return service.buscarPorProtocoloESenha(protocolo, senha)
            .map(m -> {
                Map<String, Object> response = new HashMap<>();
                response.put("dados", m);
                response.put("resumoAcessivel", service.gerarResumoAcessivel(m));
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @Operation(summary = "Status por voz", description = "Retorna o status da manifestação formatado para leitura de tela/voz.")
    @GetMapping("/{protocolo}/status-voz")
    public ResponseEntity<?> buscarStatusVoz(
            @PathVariable String protocolo,
            @RequestParam("senha") String senha) {

        return service.buscarPorProtocoloESenha(protocolo, senha)
            .map(m -> ResponseEntity.ok(Map.of("resumoAcessivel", service.gerarResumoAcessivel(m))))
            .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @Operation(summary = "Atualizar Status (Admin)", description = "Altera o status de uma manifestação (Ex: RECEBIDO para EM_ANALISE).")
    @PatchMapping("/{protocolo}/status")
    public ResponseEntity<?> mudarStatus(
        @PathVariable String protocolo,
        @RequestParam ProtocoloStatusEnum novoStatus) {

        return service.buscarPorProtocolo(protocolo)
            .map(m -> {
                m.setStatus(novoStatus);
                service.salvarSimples(m);
                return ResponseEntity.ok("Status atualizado!");
            })
            .orElse(ResponseEntity.notFound().build());
    }

}