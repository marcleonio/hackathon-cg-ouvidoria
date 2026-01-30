package br.com.cg.ouvidoria;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@DisplayName("Testes da Aplicação Ouvidoria")
class OuvidoriaApplicationTests {

	@Test
	@DisplayName("Contexto da aplicação deve carregar com sucesso")
	void contextLoads() {
		// Teste que verifica se o contexto Spring Boot carrega sem erros
	}
}
