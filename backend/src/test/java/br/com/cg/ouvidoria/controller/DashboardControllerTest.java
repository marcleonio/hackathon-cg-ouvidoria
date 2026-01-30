package br.com.cg.ouvidoria.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import br.com.cg.ouvidoria.service.DashboardService;
import br.com.cg.ouvidoria.service.ManifestacaoService;

@WebMvcTest(DashboardController.class)
@DisplayName("Testes da DashboardController")
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DashboardService dashboardService;

    @MockitoBean
    private ManifestacaoService manifestacaoService;

    private Map<String, Object> dashboardData;

    @BeforeEach
    void setUp() {
        dashboardData = new HashMap<>();
        dashboardData.put("total", 10L);
        dashboardData.put("distribuicaoStatus", Map.of("RECEBIDO", 5L, "ANALISANDO", 3L, "RESOLVIDO", 2L));
        dashboardData.put("distribuicaoTipo", Map.of("RECLAMACAO", 6L, "SUGESTAO", 3L, "ELOGIO", 1L));
        dashboardData.put("usoMidias", Map.of("audio", 8L, "video", 3L, "imagem", 5L));
        dashboardData.put("kpiUrgencia", "20.0%");
        dashboardData.put("kpiAcessibilidade", "80.0%");
        dashboardData.put("resumoVoz", "Painel de Gestão: Temos 10 manifestações...");
    }

    @Test
    @DisplayName("Deve retornar dashboard completo")
    void testGetDashCompleto() throws Exception {
        when(dashboardService.buscarDadosCompletos()).thenReturn(dashboardData);

        mockMvc.perform(get("/api/dashboard/completo")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.total").value(10))
            .andExpect(jsonPath("$.kpiUrgencia").value("20.0%"))
            .andExpect(jsonPath("$.kpiAcessibilidade").value("80.0%"))
            .andExpect(jsonPath("$.usoMidias.audio").value(8))
            .andExpect(jsonPath("$.usoMidias.video").value(3))
            .andExpect(jsonPath("$.usoMidias.imagem").value(5));

        verify(dashboardService, times(1)).buscarDadosCompletos();
    }

    @Test
    @DisplayName("Deve retornar distribuição de status no dashboard")
    void testGetDashCompletoDistribuicaoStatus() throws Exception {
        when(dashboardService.buscarDadosCompletos()).thenReturn(dashboardData);

        mockMvc.perform(get("/api/dashboard/completo")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.distribuicaoStatus.RECEBIDO").value(5))
            .andExpect(jsonPath("$.distribuicaoStatus.ANALISANDO").value(3))
            .andExpect(jsonPath("$.distribuicaoStatus.RESOLVIDO").value(2));
    }

    @Test
    @DisplayName("Deve retornar distribuição de tipo no dashboard")
    void testGetDashCompletoDistribuicaoTipo() throws Exception {
        when(dashboardService.buscarDadosCompletos()).thenReturn(dashboardData);

        mockMvc.perform(get("/api/dashboard/completo")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.distribuicaoTipo.RECLAMACAO").value(6))
            .andExpect(jsonPath("$.distribuicaoTipo.SUGESTAO").value(3))
            .andExpect(jsonPath("$.distribuicaoTipo.ELOGIO").value(1));
    }

    @Test
    @DisplayName("Deve retornar resumo em voz no dashboard")
    void testGetDashCompletoResumoVoz() throws Exception {
        when(dashboardService.buscarDadosCompletos()).thenReturn(dashboardData);

        mockMvc.perform(get("/api/dashboard/completo")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.resumoVoz").exists());
    }

    @Test
    @DisplayName("Deve retornar KPIs rápidos")
    void testGetKPIs() throws Exception {
        Map<String, Object> kpis = Map.of(
            "urgencia", "20.0%",
            "acessibilidade", "80.0%",
            "total", 10L
        );
        when(dashboardService.gerarKPIs()).thenReturn(kpis);

        mockMvc.perform(get("/api/dashboard/kpis")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.urgencia").value("20.0%"))
            .andExpect(jsonPath("$.acessibilidade").value("80.0%"))
            .andExpect(jsonPath("$.total").value(10));

        verify(dashboardService, times(1)).gerarKPIs();
    }

    @Test
    @DisplayName("Deve retornar KPIs zerados quando vazio")
    void testGetKPIsVazio() throws Exception {
        Map<String, Object> kpisVazios = Map.of(
            "urgencia", "0%",
            "acessibilidade", "0%",
            "total", 0L
        );
        when(dashboardService.gerarKPIs()).thenReturn(kpisVazios);

        mockMvc.perform(get("/api/dashboard/kpis")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.urgencia").value("0%"))
            .andExpect(jsonPath("$.acessibilidade").value("0%"))
            .andExpect(jsonPath("$.total").value(0));
    }

    @Test
    @DisplayName("Deve retornar dashboard completo com formato JSON válido")
    void testGetDashCompletoFormatoJSON() throws Exception {
        when(dashboardService.buscarDadosCompletos()).thenReturn(dashboardData);

        mockMvc.perform(get("/api/dashboard/completo")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Deve retornar KPIs com formato JSON válido")
    void testGetKPIsFormatoJSON() throws Exception {
        Map<String, Object> kpis = Map.of(
            "urgencia", "20.0%",
            "acessibilidade", "80.0%",
            "total", 10L
        );
        when(dashboardService.gerarKPIs()).thenReturn(kpis);

        mockMvc.perform(get("/api/dashboard/kpis")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
