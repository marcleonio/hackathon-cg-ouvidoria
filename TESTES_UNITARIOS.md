# Testes Unitários - Projeto Ouvidoria

## 📋 Resumo dos Testes Gerados

Este documento apresenta um resumo de todos os testes unitários gerados para o projeto Ouvidoria.

---

## 🧪 Testes por Camada

### 1. **Testes de Service** 

#### ManifestacaoServiceTest
Localização: `src/test/java/br/com/cg/ouvidoria/service/ManifestacaoServiceTest.java`

**Cobertura:**
- ✅ Salvar manifestação simples com sucesso
- ✅ Buscar manifestação por protocolo
- ✅ Retornar vazio ao buscar protocolo inexistente
- ✅ Salvar manifestação com arquivos de mídia (áudio, imagem, vídeo)
- ✅ Salvar manifestação com apenas áudio
- ✅ Gerar protocolo com formato correto (PROT-AAAA + 6 dígitos)
- ✅ Gerar senha aleatória com 4 dígitos
- ✅ Gerar resumo acessível com informações corretas
- ✅ Validar senha correta com sucesso
- ✅ Rejeitar senha incorreta

**Total: 10 testes**

---

#### DashboardServiceTest
Localização: `src/test/java/br/com/cg/ouvidoria/service/DashboardServiceTest.java`

**Cobertura:**
- ✅ Retornar dados completos do dashboard
- ✅ Contar corretamente manifestações com áudio
- ✅ Calcular KPI de acessibilidade corretamente (66.7%)
- ✅ Gerar texto acessível para dashboard não vazio
- ✅ Retornar dashboard vazio quando não há manifestações
- ✅ Gerar KPIs com sucesso
- ✅ Retornar KPIs zerados quando repositório está vazio
- ✅ Contar corretamente manifestações com vídeo

**Total: 8 testes**

---

#### AnaliseTextoServiceTest
Localização: `src/test/java/br/com/cg/ouvidoria/service/AnaliseTextoServiceTest.java`

**Cobertura:**
- ✅ Classificar texto com 'perigo' como ALTA criticidade
- ✅ Classificar texto com 'urgente' como ALTA criticidade
- ✅ Classificar texto com 'risco' como ALTA criticidade
- ✅ Classificar texto com 'grave' como ALTA criticidade
- ✅ Classificar texto com 'emergência' como ALTA criticidade
- ✅ Classificar texto com 'morte' como ALTA criticidade
- ✅ Classificar texto com 'socorro' como ALTA criticidade
- ✅ Classificar texto normal como NORMAL criticidade
- ✅ Classificar texto vazio como NORMAL
- ✅ Classificar texto nulo como NORMAL
- ✅ Classificar texto em branco como NORMAL
- ✅ Case-insensitive na busca de palavras críticas
- ✅ Detectar múltiplas palavras críticas
- ✅ Classificar corretamente textos com palavras similares

**Total: 14 testes**

---

#### FileServiceTest
Localização: `src/test/java/br/com/cg/ouvidoria/service/FileServiceTest.java`

**Cobertura:**
- ✅ Salvar arquivo com sucesso
- ✅ Gerar nomes únicos para cada arquivo
- ✅ Salvar arquivo com extensão correta
- ✅ Retornar URL com formato correto
- ✅ Lançar exceção ao salvar arquivo com erro
- ✅ Criar diretório uploads se não existir
- ✅ Salvar arquivo em diretório correto

**Total: 7 testes**

---

### 2. **Testes de Controller**

#### ManifestacaoControllerTest
Localização: `src/test/java/br/com/cg/ouvidoria/controller/ManifestacaoControllerTest.java`

**Cobertura:**
- ✅ Criar manifestação com sucesso
- ✅ Buscar manifestação por protocolo e senha
- ✅ Retornar 403 ao buscar com senha incorreta
- ✅ Retornar status por voz
- ✅ Retornar 403 ao buscar status com senha incorreta
- ✅ Mudar status da manifestação
- ✅ Retornar 404 ao mudar status de protocolo inexistente
- ✅ Criar manifestação anônima

**Total: 8 testes**

---

#### DashboardControllerTest
Localização: `src/test/java/br/com/cg/ouvidoria/controller/DashboardControllerTest.java`

**Cobertura:**
- ✅ Retornar dashboard completo
- ✅ Retornar distribuição de status no dashboard
- ✅ Retornar distribuição de tipo no dashboard
- ✅ Retornar resumo em voz no dashboard
- ✅ Retornar KPIs rápidos
- ✅ Retornar KPIs zerados quando vazio
- ✅ Retornar dashboard completo com formato JSON válido
- ✅ Retornar KPIs com formato JSON válido

**Total: 8 testes**

---

### 3. **Testes de Aplicação**

#### OuvidoriaApplicationTests
Localização: `src/test/java/br/com/cg/ouvidoria/OuvidoriaApplicationTests.java`

**Cobertura:**
- ✅ Contexto da aplicação deve carregar com sucesso

**Total: 1 teste**

---

## 📊 Estatísticas Gerais

| Camada | Quantidade | Total de Testes |
|--------|-----------|-----------------|
| Services | 4 classes | 39 testes |
| Controllers | 2 classes | 16 testes |
| Application | 1 classe | 1 teste |
| **TOTAL** | **7 classes** | **56 testes** |

---

## 🛠️ Tecnologias Utilizadas

- **JUnit 5** - Framework de testes
- **Mockito** - Mocking e verificação de interações
- **Spring Test** - Testes de integração com Spring
- **MockMvc** - Testes de controllers
- **@WebMvcTest** - Testes em camada de controller
- **@ExtendWith(MockitoExtension.class)** - Integração Mockito com JUnit 5

---

## 🚀 Como Executar os Testes

### Executar todos os testes:
```bash
cd backend
mvn test
```

### Executar testes de uma classe específica:
```bash
mvn test -Dtest=ManifestacaoServiceTest
```

### Executar teste específico:
```bash
mvn test -Dtest=ManifestacaoServiceTest#testSalvarSimples
```

### Executar com cobertura de código:
```bash
mvn test jacoco:report
```

---

## 📝 Padrões de Teste Utilizados

### 1. **Arrange-Act-Assert (AAA)**
Cada teste segue o padrão AAA para clareza:
```java
@Test
void testExample() {
    // Arrange: configurar dados de teste
    when(repository.save(manifestacao)).thenReturn(manifestacao);
    
    // Act: executar ação
    Manifestacao resultado = service.salvarSimples(manifestacao);
    
    // Assert: verificar resultado
    assertEquals(manifestacao.getId(), resultado.getId());
}
```

### 2. **Mocking com Mockito**
Utilizamos mocks para isolar as classes sob teste:
```java
@Mock
private ManifestacaoRepository repository;

@InjectMocks
private ManifestacaoService service;
```

### 3. **DisplayName para Clareza**
Cada teste possui um nome descritivo em português:
```java
@DisplayName("Deve salvar manifestação com sucesso")
void testSalvarComSucesso()
```

---

## ✅ Funcionalidades Cobertas

### Manifestações
- Criar manifestações com suporte a múltiplas mídias
- Buscar manifestações por protocolo
- Validação de senha criptografada
- Geração de resumo acessível
- Classificação de criticidade baseada em análise textual

### Dashboard
- Agregação de dados completos
- Cálculo de KPIs (urgência e acessibilidade)
- Distribuição por status e tipo
- Geração de resumo em voz para acessibilidade

### Gerenciamento de Arquivos
- Upload de áudio, imagem e vídeo
- Geração de URLs únicas
- Tratamento de erros

---

## 🐛 Casos de Erro Cobertos

- ❌ Senha incorreta → 403 Forbidden
- ❌ Protocolo inexistente → vazio/404 Not Found
- ❌ Arquivo inválido → RuntimeException
- ❌ Texto nulo/vazio → Tratamento seguro

---

## 📚 Estrutura das Pastas de Teste

```
src/test/java/br/com/cg/ouvidoria/
├── service/
│   ├── ManifestacaoServiceTest.java
│   ├── DashboardServiceTest.java
│   ├── AnaliseTextoServiceTest.java
│   └── FileServiceTest.java
├── controller/
│   ├── ManifestacaoControllerTest.java
│   └── DashboardControllerTest.java
└── OuvidoriaApplicationTests.java
```

---

## 🎯 Próximos Passos

Para aumentar a cobertura de testes:

1. **Testes de Integração**: Testar fluxos completos de ponta a ponta
2. **Testes de Performance**: Validar tempos de resposta
3. **Testes de Segurança**: Validar autenticação e autorização
4. **Testes de Banco de Dados**: Repository pattern com @DataJpaTest

---

## 📞 Suporte

Para dúvidas sobre os testes, consulte:
- [Documentação JUnit 5](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Test Documentation](https://spring.io/guides/gs/testing-web/)

---

**Gerado em:** 30 de janeiro de 2026
**Versão:** 1.0
