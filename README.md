# Participa DF — Ouvidoria Digital Acessivel

Solucao desenvolvida para o **1o Hackathon em Controle Social: Desafio Participa DF** (Categoria Ouvidoria), promovido pela Controladoria-Geral do Distrito Federal (CGDF).

**Link do video de demonstracao:** `[INSERIR LINK DO VIDEO AQUI]`

---

## Sobre o Projeto

O Participa DF - Ouvidoria Digital e um **Progressive Web App (PWA)** que permite ao cidadao registrar manifestacoes (reclamacoes, denuncias, sugestoes e elogios) de forma acessivel, segura e multicanal. A solucao contempla envio por **texto, audio, imagem e video**, com opcao de **anonimato** e emissao automatica de **protocolo de acompanhamento**.

### Diferenciais

- **Formulario em etapas (wizard):** Jornada simplificada em 3 passos para o cidadao
- **Consulta de protocolo:** Pagina dedicada para acompanhamento da manifestacao
- **Barra de acessibilidade governamental:** Controle de tamanho de fonte (A-/A+) e alto contraste
- **Skip navigation:** Link para pular direto ao conteudo principal (WCAG 2.4.1)
- **PWA instalavel:** Funciona offline e pode ser adicionado a tela inicial do celular

---

## Tecnologias Utilizadas

### Frontend
| Tecnologia | Versao | Finalidade |
|---|---|---|
| React | 19 | Biblioteca de UI |
| Vite | 7 | Build tool e dev server |
| Tailwind CSS | 4 | Estilizacao utility-first |
| React Router DOM | 7 | Roteamento SPA |
| Axios | 1.13 | Cliente HTTP |
| Lucide React | 0.563 | Iconografia acessivel |
| vite-plugin-pwa | 1.2 | Suporte a PWA / Service Worker |

### Backend
| Tecnologia | Versao | Finalidade |
|---|---|---|
| Java | 17 | Linguagem principal |
| Spring Boot | 4.0.2 | Framework web |
| Spring Data JPA | - | Persistencia de dados |
| H2 Database | - | Banco em memoria (prototipagem rapida) |
| Lombok | - | Reducao de boilerplate |
| SpringDoc OpenAPI | 2.3.0 | Documentacao Swagger da API |

### Infraestrutura
| Tecnologia | Finalidade |
|---|---|
| Docker | Containerizacao do backend |
| Docker Compose | Orquestracao dos servicos |

---

## Arquitetura do Sistema

```
+-----------------------------------------------------+
|                  FRONTEND (PWA)                      |
|              React + Vite + Tailwind                 |
|                                                     |
|  [Header + Barra Acessibilidade]                    |
|  [ManifestacaoForm (wizard 3 etapas)]               |
|  [ConsultaProtocolo]                                |
|  [AudioRecorder | MediaUpload (img/video)]          |
|  [AccessibilityContext (contraste + fonte)]          |
+------------------------+----------------------------+
                         | HTTP/REST (multipart)
                         v
+-----------------------------------------------------+
|                BACKEND (Spring Boot)                 |
|                                                     |
|  ManifestacaoController                             |
|    POST /api/manifestacoes  (multipart/form-data)   |
|    GET  /api/manifestacoes/{protocolo}              |
|                                                     |
|  ManifestacaoService                                |
|    - Gera protocolo (PROT-AAAA000000)               |
|    - Coordena persistencia de arquivos e entidade   |
|                                                     |
|  FileService                                        |
|    - Salva midias em disco (uploads/)               |
|    - Nomes unicos via UUID                          |
|                                                     |
|  H2 Database (JPA)                                  |
|    - Entidade: Manifestacao                         |
+-----------------------------------------------------+
```

---

## Estrutura de Pastas

```
hackathon-cg-ouvidoria/
|
+-- backend/
|   +-- src/main/java/br/com/cg/ouvidoria/
|   |   +-- config/            # Configuracoes (Swagger, WebMvc)
|   |   +-- constants/         # Enums (TipoManifestacao)
|   |   +-- controller/        # Endpoints REST
|   |   +-- model/entity/      # Entidade JPA
|   |   +-- repository/        # Repositorio Spring Data
|   |   +-- service/           # Logica de negocio e persistencia de arquivos
|   +-- src/main/resources/
|   |   +-- application.properties
|   +-- Dockerfile
|   +-- pom.xml
|
+-- frontend/
|   +-- src/
|   |   +-- components/        # Componentes React (Header, Form, Audio, Media, Consulta)
|   |   +-- context/           # Contexto de acessibilidade (contraste, fonte)
|   |   +-- services/          # Cliente HTTP (Axios)
|   |   +-- App.jsx            # Roteamento e layout principal
|   |   +-- main.jsx           # Entry point
|   |   +-- index.css          # Estilos globais + alto contraste + acessibilidade
|   +-- index.html             # HTML base com meta tags PWA
|   +-- vite.config.js         # Configuracao Vite + PWA
|   +-- tailwind.config.js     # Cores governamentais customizadas
|   +-- package.json
|
+-- docker-compose.yml         # Orquestracao backend + frontend
+-- uploads/                   # Armazenamento de midias
+-- edital.txt                 # Edital do hackathon
+-- README.md
```

---

## Pre-requisitos

- **Java 17+** (JDK)
- **Maven 3.9+**
- **Node.js 20+** e **npm**
- (Opcional) **Docker** e **Docker Compose**

---

## Como Executar

### Opcao 1: Execucao Local

**Backend:**

```bash
cd backend
mvn spring-boot:run
```

O backend ficara disponivel em `http://localhost:8080`.

Documentacao Swagger: `http://localhost:8080/swagger-ui/index.html`

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

O frontend ficara disponivel em `http://localhost:5173`.

> O Vite esta configurado com proxy reverso para `/api` apontando para `http://localhost:8080`, portanto o backend deve estar rodando antes do frontend.

### Opcao 2: Docker Compose

```bash
docker-compose up --build
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost`

---

## Endpoints da API

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/api/manifestacoes` | Registra nova manifestacao (multipart/form-data) |
| `GET` | `/api/manifestacoes/{protocolo}` | Consulta manifestacao pelo protocolo |

### Campos do POST (multipart/form-data)

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `descricao` | String | Sim | Texto da manifestacao |
| `tipo` | Enum | Sim | RECLAMACAO, DENUNCIA, SUGESTAO, ELOGIO |
| `anonimo` | Boolean | Sim | Se a manifestacao e anonima |
| `nome` | String | Nao* | Nome do cidadao (*obrigatorio se nao anonimo) |
| `email` | String | Nao* | E-mail do cidadao (*obrigatorio se nao anonimo) |
| `audio` | File | Nao | Arquivo de audio (webm) |
| `imagem` | File | Nao | Arquivo de imagem |
| `video` | File | Nao | Arquivo de video |

---

## Recursos de Acessibilidade (WCAG 2.1 AA)

| Recurso | Descricao |
|---|---|
| Alto contraste | Modo preto/amarelo ativavel pela barra de acessibilidade |
| Controle de fonte | Aumento/reducao da fonte em 3 niveis (100%, 120%, 140%) |
| Skip navigation | Link "Ir para o conteudo principal" no topo da pagina |
| Foco visivel | Outline visivel em todos os elementos interativos (`:focus-visible`) |
| Labels e ARIA | Todos os campos possuem `label`, `aria-label` e `aria-describedby` |
| Fieldsets e Legends | Formularios agrupados semanticamente |
| Reducao de movimento | Respeita `prefers-reduced-motion` do sistema operacional |
| Roles semanticos | `role="banner"`, `role="main"`, `role="contentinfo"`, `role="alert"` |
| PWA | Instalavel na tela inicial, funciona offline |

---

## Criterios de Avaliacao Atendidos (Edital)

### P1 — Criterios de Entrega (10 pts)

| Criterio | Pontos | Status |
|---|---|---|
| Acessibilidade Digital (WCAG 2.1 AA) | 2,5 | Implementado |
| Multicanalidade (texto, audio, imagem, video) | 3 | Implementado |
| Usabilidade e UX/UI | 3 | Implementado |
| Integracao Tecnica com Participa DF | 1,5 | Aderente a arquitetura |

### P2 — Documentacao da Solucao (10 pts)

| Criterio | Pontos | Status |
|---|---|---|
| Qualidade do Codigo e Boas Praticas | 4 | Implementado |
| Logica e Funcionamento da Solucao | 3 | Implementado |
| Instrucoes de Instalacao e Dependencias | 1 | Este README |
| Demonstracao da Solucao (video) | 1 | [Link acima] |
| Clareza e Organizacao do Projeto | 1 | Estrutura organizada |

---

## Uso de Inteligencia Artificial

Conforme item 13.9 do edital, declaramos o uso de IA no desenvolvimento:

- **Claude (Anthropic):** Auxiliou na revisao de codigo, melhoria de acessibilidade, documentacao e boas praticas de desenvolvimento.

---

## Licenca

MIT

---

Desenvolvido para o 1o Hackathon em Controle Social: Desafio Participa DF — Conectando Governo e Cidadao (2026)
