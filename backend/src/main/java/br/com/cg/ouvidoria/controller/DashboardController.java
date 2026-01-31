package br.com.cg.ouvidoria.controller;

import br.com.cg.ouvidoria.service.DashboardService;
import br.com.cg.ouvidoria.service.ManifestacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Dashboard", description = "Endpoints para gestão e análise de dados da Ouvidoria")
public class DashboardController {

    private final DashboardService service;

    @Operation(summary = "Dados consolidados", description = "Retorna KPIs, distribuição por status/tipo, uso de mídias e resumo em áudio.")
    @ApiResponse(responseCode = "200", description = "Dashboard gerado com sucesso")
    @GetMapping("/completo")
    public ResponseEntity<Map<String, Object>> getDashCompleto() {
        return ResponseEntity.ok(service.buscarDadosCompletos());
    }

    @Operation(summary = "KPIs rápidos", description = "Retorna apenas as porcentagens de urgência, acessibilidade e total de registros.")
    @ApiResponse(responseCode = "200", description = "KPIs retornados com sucesso")
    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getKPIs() {
        return ResponseEntity.ok(service.gerarKPIs());
    }
}