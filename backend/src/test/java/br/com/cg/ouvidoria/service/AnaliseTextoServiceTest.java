package br.com.cg.ouvidoria.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes da AnaliseTextoService")
class AnaliseTextoServiceTest {

    @InjectMocks
    private AnaliseTextoService service;

    @Test
    @DisplayName("Deve classificar texto com 'perigo' como ALTA criticidade")
    void testCalcularCriticidadeComPerigo() {
        String resultado = service.calcularCriticidade("Existe um perigo iminente nesta área");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto com 'urgente' como ALTA criticidade")
    void testCalcularCriticidadeComUrgente() {
        String resultado = service.calcularCriticidade("Preciso de atendimento urgente");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto com 'risco' como ALTA criticidade")
    void testCalcularCriticidadeComRisco() {
        String resultado = service.calcularCriticidade("Há risco de colapso na estrutura");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto com 'grave' como ALTA criticidade")
    void testCalcularCriticidadeComGrave() {
        String resultado = service.calcularCriticidade("Situação grave no local");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto com 'emergência' como ALTA criticidade")
    void testCalcularCriticidadeComEmergencia() {
        String resultado = service.calcularCriticidade("É uma emergência médica");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto com 'morte' como ALTA criticidade")
    void testCalcularCriticidadeComMorte() {
        String resultado = service.calcularCriticidade("Risco de morte se não houver intervenção");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto com 'socorro' como ALTA criticidade")
    void testCalcularCriticidadeComSocorro() {
        String resultado = service.calcularCriticidade("Precisamos de socorro imediato");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto normal como NORMAL criticidade")
    void testCalcularCriticidadeNormal() {
        String resultado = service.calcularCriticidade("Gostaria de sugerir melhorias no atendimento");
        assertEquals("NORMAL", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto vazio como NORMAL")
    void testCalcularCriticidadeVazio() {
        String resultado = service.calcularCriticidade("");
        assertEquals("NORMAL", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto nulo como NORMAL")
    void testCalcularCriticidadeNulo() {
        String resultado = service.calcularCriticidade(null);
        assertEquals("NORMAL", resultado);
    }

    @Test
    @DisplayName("Deve classificar texto em branco como NORMAL")
    void testCalcularCriticidadeBranco() {
        String resultado = service.calcularCriticidade("   ");
        assertEquals("NORMAL", resultado);
    }

    @Test
    @DisplayName("Deve ser case-insensitive na busca de palavras críticas")
    void testCalcularCriticidadeCaseInsensitive() {
        String resultado = service.calcularCriticidade("PERIGO no local");
        assertEquals("ALTA", resultado);

        resultado = service.calcularCriticidade("Urgente!!! Preciso ajuda");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve detectar múltiplas palavras críticas")
    void testCalcularCriticidadeMultiplasPalavras() {
        String resultado = service.calcularCriticidade("Situação grave e urgente, há risco");
        assertEquals("ALTA", resultado);
    }

    @Test
    @DisplayName("Deve classificar corretamente textos com palavras similares mas não críticas")
    void testCalcularCriticidadePalavrasSimilares() {
        String resultado = service.calcularCriticidade("Preciso de ajuda para entender o processo");
        assertEquals("NORMAL", resultado);

        resultado = service.calcularCriticidade("O atendimento foi rápido e eficiente");
        assertEquals("NORMAL", resultado);
    }
}
