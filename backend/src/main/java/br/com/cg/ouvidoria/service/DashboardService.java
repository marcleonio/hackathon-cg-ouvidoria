package br.com.cg.ouvidoria.service;

import br.com.cg.ouvidoria.model.entity.Manifestacao;
import br.com.cg.ouvidoria.repository.ManifestacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ManifestacaoRepository repository;
    private final AnaliseTextoService analiseTextoService;

    public Map<String, Object> buscarDadosCompletos() {
        Map<String, Object> dash = new HashMap<>();
        List<Manifestacao> todas = repository.findAll();
        long total = todas.size();

        // 1. Contagens de Mídias
        long comAudio = repository.countByAnexoAudioUrlIsNotNull();
        long comVideo = repository.countByAnexoVideoUrlIsNotNull();
        long comImagem = repository.countByAnexoImagemUrlIsNotNull();

        // 2. Cálculo de Criticidade (IA Lite)
        long criticas = todas.stream()
          .filter(m -> "ALTA".equals(analiseTextoService.calcularCriticidade(m.getDescricao())))
          .count();

        // 3. Estrutura de Dados para o Front
        dash.put("total", total);
        dash.put("distribuicaoStatus", repository.countByStatus());
        dash.put("distribuicaoTipo", repository.countByTipo());
        dash.put("usoMidias", Map.of("audio", comAudio, "video", comVideo, "imagem", comImagem));

        // 4. KPIs formatados
        dash.put("kpiUrgencia", total > 0 ? String.format("%.1f%%", (double) criticas / total * 100) : "0%");
        dash.put("kpiAcessibilidade", total > 0 ? String.format("%.1f%%", (double) comAudio / total * 100) : "0%");

        // 5. Resumo de Voz Consolidado (Cidadão + Gestor)
        dash.put("resumoVoz", gerarTextoAcessivel(total, criticas, comAudio));

        return dash;
    }

    private String gerarTextoAcessivel(long total, long criticas, long comAudio) {
        if (total == 0) return "Painel de controle vazio. Nenhuma manifestação registrada até o momento.";

        return String.format(
            "Painel de Gestão: Temos %d manifestações no total. " +
            "Identificamos %d casos de alta criticidade que requerem atenção imediata. " +
            "O uso de áudio alcançou %d por cento dos usuários, garantindo a inclusão digital proposta.",
            total, criticas, (comAudio * 100 / total)
        );
    }

    public Map<String, Object> gerarKPIs() {
        Map<String, Object> kpis = new HashMap<>();
        long total = repository.count();

        if (total == 0) {
            return Map.of(
                "urgencia", "0%",
                "acessibilidade", "0%",
                "total", 0
            );
        }

        // KPI 1: Índice de Urgência (Baseado no seu método de criticidade)
        long criticas = repository.findAll().stream()
            .filter(m -> "ALTA".equals(analiseTextoService.calcularCriticidade(m.getDescricao())))
            .count();
        double taxaUrgencia = (double) criticas / total * 100;

        // KPI 2: Taxa de Acessibilidade (Baseado no envio de áudio)
        long comAudio = repository.countByAnexoAudioUrlIsNotNull();
        double taxaAcessibilidade = (double) comAudio / total * 100;

        kpis.put("urgencia", String.format("%.1f%%", taxaUrgencia));
        kpis.put("acessibilidade", String.format("%.1f%%", taxaAcessibilidade));
        kpis.put("total", total);

        return kpis;
    }
}