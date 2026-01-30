package br.com.cg.ouvidoria.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.cg.ouvidoria.constants.ProtocoloStatusEnum;
import br.com.cg.ouvidoria.constants.TipoManifestacaoEnum;
import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.repository.ManifestacaoRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes da DashboardService")
class DashboardServiceTest {

    @Mock
    private ManifestacaoRepository repository;

    @Mock
    private AnaliseTextoService analiseTextoService;

    @InjectMocks
    private DashboardService service;

    private List<Manifestacao> manifestacoes;

    @BeforeEach
    void setUp() {
        Manifestacao m1 = new Manifestacao();
        m1.setId(1L);
        m1.setTipo(TipoManifestacaoEnum.RECLAMACAO);
        m1.setDescricao("Problema crítico");
        m1.setAnexoAudioUrl("url_audio_1");
        m1.setStatus(ProtocoloStatusEnum.RECEBIDO);

        Manifestacao m2 = new Manifestacao();
        m2.setId(2L);
        m2.setTipo(TipoManifestacaoEnum.SUGESTAO);
        m2.setDescricao("Sugestão de melhorias");
        m2.setAnexoAudioUrl("url_audio_2");
        m2.setAnexoImagemUrl("url_imagem_2");
        m2.setStatus(ProtocoloStatusEnum.EM_ANALISE);

        Manifestacao m3 = new Manifestacao();
        m3.setId(3L);
        m3.setTipo(TipoManifestacaoEnum.ELOGIO);
        m3.setDescricao("Elogio ao atendimento");
        m3.setAnexoVideoUrl("url_video_3");
        m3.setStatus(ProtocoloStatusEnum.CONCLUIDO);

        manifestacoes = Arrays.asList(m1, m2, m3);
    }

    @Test
    @DisplayName("Deve retornar dados completos do dashboard")
    void testBuscarDadosCompletos() {
        when(repository.findAll()).thenReturn(manifestacoes);
        when(repository.countByAnexoAudioUrlIsNotNull()).thenReturn(2L);
        when(repository.countByAnexoVideoUrlIsNotNull()).thenReturn(1L);
        when(repository.countByAnexoImagemUrlIsNotNull()).thenReturn(1L);

        // Mock para countByStatus() retornando List<Object[]>
        List<Object[]> statusData = Arrays.asList(
            new Object[]{ProtocoloStatusEnum.RECEBIDO, 1L},
            new Object[]{ProtocoloStatusEnum.EM_ANALISE, 1L},
            new Object[]{ProtocoloStatusEnum.CONCLUIDO, 1L}
        );
        when(repository.countByStatus()).thenReturn(statusData);

        // Mock para countByTipo() retornando List<Object[]>
        List<Object[]> tipoData = Arrays.asList(
            new Object[]{"RECLAMACAO", 1L},
            new Object[]{"SUGESTAO", 1L},
            new Object[]{"ELOGIO", 1L}
        );
        when(repository.countByTipo()).thenReturn(tipoData);

        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");

        Map<String, Object> resultado = service.buscarDadosCompletos();

        assertNotNull(resultado);
        assertEquals(3L, resultado.get("total"));
        assertNotNull(resultado.get("distribuicaoStatus"));
        assertNotNull(resultado.get("distribuicaoTipo"));
        assertNotNull(resultado.get("usoMidias"));
        assertNotNull(resultado.get("kpiUrgencia"));
        assertNotNull(resultado.get("kpiAcessibilidade"));
        assertNotNull(resultado.get("resumoVoz"));
    }

    @Test
    @DisplayName("Deve contar corretamente manifestações com áudio")
    void testContarManifestacoeComAudio() {
        when(repository.findAll()).thenReturn(manifestacoes);
        when(repository.countByAnexoAudioUrlIsNotNull()).thenReturn(2L);
        when(repository.countByAnexoVideoUrlIsNotNull()).thenReturn(1L);
        when(repository.countByAnexoImagemUrlIsNotNull()).thenReturn(1L);
        when(repository.countByStatus()).thenReturn(new ArrayList<Object[]>());
        when(repository.countByTipo()).thenReturn(new ArrayList<Object[]>());
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");

        Map<String, Object> resultado = service.buscarDadosCompletos();

        @SuppressWarnings("unchecked")
        Map<String, Long> midias = (Map<String, Long>) resultado.get("usoMidias");
        assertEquals(2L, midias.get("audio"));
    }

    @Test
    @DisplayName("Deve calcular KPI de acessibilidade corretamente")
    void testCalcularKPIAcessibilidade() {
        when(repository.findAll()).thenReturn(manifestacoes);
        when(repository.countByAnexoAudioUrlIsNotNull()).thenReturn(2L);
        when(repository.countByAnexoVideoUrlIsNotNull()).thenReturn(1L);
        when(repository.countByAnexoImagemUrlIsNotNull()).thenReturn(1L);
        when(repository.countByStatus()).thenReturn(new ArrayList<Object[]>());
        when(repository.countByTipo()).thenReturn(new ArrayList<Object[]>());
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");

        Map<String, Object> resultado = service.buscarDadosCompletos();

        String kpiAcessibilidade = (String) resultado.get("kpiAcessibilidade");
        assertEquals("66,7%", kpiAcessibilidade);
    }

    @Test
    @DisplayName("Deve gerar texto acessível para dashboard não vazio")
    void testGerarTextoAcessivelComDados() {
        when(repository.findAll()).thenReturn(manifestacoes);
        when(repository.countByAnexoAudioUrlIsNotNull()).thenReturn(2L);
        when(repository.countByAnexoVideoUrlIsNotNull()).thenReturn(1L);
        when(repository.countByAnexoImagemUrlIsNotNull()).thenReturn(1L);
        when(repository.countByStatus()).thenReturn(new ArrayList<Object[]>());
        when(repository.countByTipo()).thenReturn(new ArrayList<Object[]>());
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");

        Map<String, Object> resultado = service.buscarDadosCompletos();

        String resumoVoz = (String) resultado.get("resumoVoz");
        assertNotNull(resumoVoz);
        assertTrue(resumoVoz.contains("Painel de Gestão"));
        assertTrue(resumoVoz.contains("3"));
    }

    @Test
    @DisplayName("Deve retornar dashboard vazio quando não há manifestações")
    void testBuscarDadosCompaletosVazio() {
        when(repository.findAll()).thenReturn(Arrays.asList());
        when(repository.countByAnexoAudioUrlIsNotNull()).thenReturn(0L);
        when(repository.countByAnexoVideoUrlIsNotNull()).thenReturn(0L);
        when(repository.countByAnexoImagemUrlIsNotNull()).thenReturn(0L);
        when(repository.countByStatus()).thenReturn(new ArrayList<Object[]>());
        when(repository.countByTipo()).thenReturn(new ArrayList<Object[]>());

        Map<String, Object> resultado = service.buscarDadosCompletos();

        assertEquals(0L, resultado.get("total"));
        String resumoVoz = (String) resultado.get("resumoVoz");
        assertTrue(resumoVoz.contains("vazio"));
    }

    @Test
    @DisplayName("Deve gerar KPIs com sucesso")
    void testGerarKPIs() {
        when(repository.count()).thenReturn(3L);
        when(repository.findAll()).thenReturn(manifestacoes);
        when(repository.countByAnexoAudioUrlIsNotNull()).thenReturn(2L);
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");

        Map<String, Object> kpis = service.gerarKPIs();

        assertNotNull(kpis);
        assertEquals("66.7%", kpis.get("acessibilidade"));
        assertEquals(3L, kpis.get("total"));
    }

    @Test
    @DisplayName("Deve retornar KPIs zerados quando repository está vazio")
    void testGerarKPIsVazio() {
        when(repository.count()).thenReturn(0L);

        Map<String, Object> kpis = service.gerarKPIs();

        assertEquals("0%", kpis.get("urgencia"));
        assertEquals("0%", kpis.get("acessibilidade"));
        assertEquals(0L, kpis.get("total"));
    }

    @Test
    @DisplayName("Deve contar corretamente manifestações com vídeo")
    void testContarManifestacoeComVideo() {
        when(repository.findAll()).thenReturn(manifestacoes);
        when(repository.countByAnexoAudioUrlIsNotNull()).thenReturn(2L);
        when(repository.countByAnexoVideoUrlIsNotNull()).thenReturn(1L);
        when(repository.countByAnexoImagemUrlIsNotNull()).thenReturn(1L);
        when(repository.countByStatus()).thenReturn(new ArrayList<Object[]>());
        when(repository.countByTipo()).thenReturn(new ArrayList<Object[]>());
        when(analiseTextoService.calcularCriticidade(anyString())).thenReturn("ALTA");

        Map<String, Object> resultado = service.buscarDadosCompletos();

        @SuppressWarnings("unchecked")
        Map<String, Long> midias = (Map<String, Long>) resultado.get("usoMidias");
        assertEquals(1L, midias.get("video"));
    }
}
