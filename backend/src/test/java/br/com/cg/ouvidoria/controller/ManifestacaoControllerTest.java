package br.com.cg.ouvidoria.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import br.com.cg.ouvidoria.constants.ProtocoloStatusEnum;
import br.com.cg.ouvidoria.constants.TipoManifestacaoEnum;
import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.service.ManifestacaoService;

@WebMvcTest(ManifestacaoController.class)
@DisplayName("Testes da ManifestacaoController")
class ManifestacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ManifestacaoService service;

    private Manifestacao manifestacao;

    @BeforeEach
    void setUp() {
        manifestacao = new Manifestacao();
        manifestacao.setId(1L);
        manifestacao.setProtocolo("PROT-20261234567");
        manifestacao.setTipo(TipoManifestacaoEnum.RECLAMACAO);
        manifestacao.setDescricao("Teste de reclamação");
        manifestacao.setNomeCidadao("João Silva");
        manifestacao.setEmailCidadao("joao@test.com");
        manifestacao.setAnonimo(false);
        manifestacao.setStatus(ProtocoloStatusEnum.RECEBIDO);
        manifestacao.setDataCriacao(LocalDateTime.now());
        manifestacao.setSenha("1234");
    }

    @Test
    @DisplayName("Deve criar manifestação com sucesso")
    void testCriarManifestacao() throws Exception {
        when(service.salvarManifestacaoComArquivos(any(), any(), any(), any()))
            .thenReturn(manifestacao);

        mockMvc.perform(multipart("/api/manifestacoes")
                .param("descricao", "Teste de reclamação")
                .param("tipo", "RECLAMACAO")
                .param("anonimo", "false")
                .param("nome", "João Silva")
                .param("email", "joao@test.com")
                .contentType(MediaType.MULTIPART_FORM_DATA))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.protocolo").value("PROT-20261234567"));

        verify(service, times(1)).salvarManifestacaoComArquivos(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Deve buscar manifestação por protocolo e senha")
    void testBuscarManifestacao() throws Exception {
        when(service.buscarPorProtocoloESenha("PROT-20261234567", "1234"))
            .thenReturn(Optional.of(manifestacao));
        when(service.gerarResumoAcessivel(manifestacao))
            .thenReturn("Resumo da manifestação");

        mockMvc.perform(get("/api/manifestacoes/{protocolo}", "PROT-20261234567")
                .param("senha", "1234")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.dados.protocolo").value("PROT-20261234567"))
            .andExpect(jsonPath("$.resumoAcessivel").value("Resumo da manifestação"));

        verify(service, times(1)).buscarPorProtocoloESenha("PROT-20261234567", "1234");
    }

    @Test
    @DisplayName("Deve retornar 403 ao buscar com senha incorreta")
    void testBuscarManifestacaoSenhaIncorreta() throws Exception {
        when(service.buscarPorProtocoloESenha("PROT-20261234567", "5678"))
            .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/manifestacoes/{protocolo}", "PROT-20261234567")
                .param("senha", "5678")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Deve retornar status por voz")
    void testBuscarStatusVoz() throws Exception {
        when(service.buscarPorProtocoloESenha("PROT-20261234567", "1234"))
            .thenReturn(Optional.of(manifestacao));
        when(service.gerarResumoAcessivel(manifestacao))
            .thenReturn("Status: Recebido");

        mockMvc.perform(get("/api/manifestacoes/{protocolo}/status-voz", "PROT-20261234567")
                .param("senha", "1234")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.resumoAcessivel").value("Status: Recebido"));
    }

    @Test
    @DisplayName("Deve retornar 403 ao buscar status com senha incorreta")
    void testBuscarStatusVozSenhaIncorreta() throws Exception {
        when(service.buscarPorProtocoloESenha("PROT-20261234567", "5678"))
            .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/manifestacoes/{protocolo}/status-voz", "PROT-20261234567")
                .param("senha", "5678")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Deve mudar status da manifestação")
    void testMudarStatus() throws Exception {
        when(service.buscarPorProtocolo("PROT-20261234567"))
            .thenReturn(Optional.of(manifestacao));
        when(service.salvarSimples(any())).thenReturn(manifestacao);

        mockMvc.perform(patch("/api/manifestacoes/{protocolo}/status", "PROT-20261234567")
                .param("novoStatus", ProtocoloStatusEnum.EM_ANALISE.toString())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value("Status atualizado!"));

        verify(service, times(1)).buscarPorProtocolo("PROT-20261234567");
        verify(service, times(1)).salvarSimples(any());
    }

    @Test
    @DisplayName("Deve retornar 404 ao mudar status de protocolo inexistente")
    void testMudarStatusProtocoloInexistente() throws Exception {
        when(service.buscarPorProtocolo("PROT-INEXISTENTE"))
            .thenReturn(Optional.empty());

        mockMvc.perform(patch("/api/manifestacoes/{protocolo}/status", "PROT-INEXISTENTE")
                .param("novoStatus", ProtocoloStatusEnum.EM_ANALISE.name())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve criar manifestação anônima")
    void testCriarManifestacaoAnonima() throws Exception {
        Manifestacao manifestacaoAnonima = new Manifestacao();
        manifestacaoAnonima.setId(2L);
        manifestacaoAnonima.setProtocolo("PROT-20262222222");
        manifestacaoAnonima.setTipo(TipoManifestacaoEnum.SUGESTAO);
        manifestacaoAnonima.setDescricao("Sugestão anônima");
        manifestacaoAnonima.setAnonimo(true);
        manifestacaoAnonima.setSenha("5678");

        when(service.salvarManifestacaoComArquivos(any(), any(), any(), any()))
            .thenReturn(manifestacaoAnonima);

        mockMvc.perform(multipart("/api/manifestacoes")
                .param("descricao", "Sugestão anônima")
                .param("tipo", "SUGESTAO")
                .param("anonimo", "true")
                .contentType(MediaType.MULTIPART_FORM_DATA))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.anonimo").value(true));
    }
}
