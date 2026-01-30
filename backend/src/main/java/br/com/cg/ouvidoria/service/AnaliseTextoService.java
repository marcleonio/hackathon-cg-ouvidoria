package br.com.cg.ouvidoria.service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnaliseTextoService {

    private static final List<String> PALAVRAS_CRITICAS =
        List.of("perigo", "urgente", "risco", "grave", "emergência", "morte", "socorro");

    public String calcularCriticidade(String descricao) {
        if (descricao == null || descricao.isBlank()) return "NORMAL";

        String texto = descricao.toLowerCase();
        boolean urgente = PALAVRAS_CRITICAS.stream().anyMatch(texto::contains);

        return urgente ? "ALTA" : "NORMAL";
    }
}