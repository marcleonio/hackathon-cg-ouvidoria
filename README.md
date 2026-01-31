# Participa DF — Ouvidoria Digital Acessivel

Solucao desenvolvida para o **1o Hackathon em Controle Social: Desafio Participa DF** (Categoria Ouvidoria), promovido pela Controladoria-Geral do Distrito Federal (CGDF).

**Link do video de demonstracao:**  https://img.youtube.com/vi/4QX7GZRb05Q/0.jpg)](https://www.youtube.com/watch?v=4QX7GZRb05Q

---

## Sobre o Projeto

O Participa DF - Ouvidoria Digital e um **Progressive Web App (PWA)** que permite ao cidadao registrar manifestacoes (reclamacoes, denuncias, sugestoes e elogios) de forma acessivel, segura e multicanal. A solucao contempla envio por **texto, audio, imagem e video**, com opcao de **anonimato**, emissao automatica de **protocolo + senha de acesso** e consulta com **leitura por voz**.

### Diferenciais

- **Multicanalidade real:** Texto e opcional — o cidadao pode registrar manifestacao apenas por audio, foto ou video
- **Formulario em etapas (wizard):** Jornada simplificada em 3 passos
- **Protocolo + senha:** Consulta segura com senha de 4 digitos criptografada (BCrypt)
- **Leitura por voz:** Status da manifestacao lido em portugues via Speech Synthesis API
- **Dashboard do gestor:** Painel com KPIs, graficos de status/tipo e resumo por voz
- **Priorizacao automatica:** Analise de texto classifica manifestacoes criticas como alta prioridade
- **Barra de acessibilidade governamental:** Controle de fonte (A-/A+) e alto contraste WCAG AAA
- **Skip navigation:** Link para pular direto ao conteudo principal (WCAG 2.4.1)
- **PWA instalavel:** Funciona offline e pode ser adicionado a tela inicial do celular
- **Stack moderna:** React 19, Spring Boot 3, Tailwind 4, Vite 7, Docker — arquitetura preparada para integracao com sistemas externos (LDAP, SSO, IA IZA)

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
| Speech Synthesis API | nativa | Leitura de status por voz |

### Backend
| Tecnologia | Versao | Finalidade |
|---|---|---|
| Java | 17 | Linguagem principal |
| Spring Boot | 4.0.2 | Framework web |
| Spring Data JPA | - | Persistencia de dados |
| BCrypt | - | Criptografia de senhas |
| H2 Database | - | Banco em memoria (prototipagem, migravel para PostgreSQL) |
| Lombok | - | Reducao de boilerplate |
| SpringDoc OpenAPI | 2.3.0 | Documentacao Swagger da API |

### Infraestrutura
| Tecnologia | Finalidade |
|---|---|
| Docker | Containerizacao (multi-stage build) |
| Docker Compose | Orquestracao dos servicos |
| Nginx | Servidor web do frontend + proxy reverso para API |

---

## Arquitetura do Sistema

```
+-----------------------------------------------------+
|                  FRONTEND (PWA)                      |
|              React + Vite + Tailwind                 |
|                                                     |
|  [Header + Barra Acessibilidade]                    |
|  [ManifestacaoForm (wizard 3 etapas)]               |
|  [ConsultaProtocolo (senha + voz)]                  |
|  [Dashboard (KPIs + graficos + voz)]                |
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
|    GET  /api/manifestacoes/{protocolo}?senha=       |
|    GET  /api/manifestacoes/{protocolo}/status-voz   |
|    GET  /api/manifestacoes/dashboard                |
|    GET  /api/manifestacoes/dashboard/kpis           |
|                                                     |
|  ManifestacaoService                                |
|    - Gera protocolo (PROT-AAAA000000) + senha 4 dig |
|    - Criptografa senha com BCrypt                    |
|    - Analise de criticidade por palavras-chave       |
|    - Coordena persistencia de arquivos e entidade    |
|                                                     |
|  FileService                                        |
|    - Salva midias em disco (uploads/)               |
|    - Nomes unicos via UUID                          |
|                                                     |
|  H2 Database (JPA) -> migravel para PostgreSQL      |
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
|   |   +-- constants/         # Enums (TipoManifestacao, StatusManifestacao)
|   |   +-- controller/        # Endpoints REST
|   |   +-- model/entity/      # Entidade JPA
|   |   +-- repository/        # Repositorio Spring Data
|   |   +-- service/           # Logica de negocio, arquivos, priorizacao
|   +-- src/main/resources/
|   |   +-- application.properties
|   +-- Dockerfile
|   +-- pom.xml
|
+-- frontend/
|   +-- src/
|   |   +-- components/        # Header, Form, Audio, Media, Consulta, Dashboard
|   |   +-- context/           # Contexto de acessibilidade (contraste, fonte)
|   |   +-- services/          # Cliente HTTP (Axios)
|   |   +-- App.jsx            # Roteamento e layout principal
|   |   +-- main.jsx           # Entry point
|   |   +-- index.css          # Estilos globais + alto contraste + animacoes
|   |   +-- theme.css          # Cores customizadas (Tailwind v4 @theme)
|   +-- index.html             # HTML base com meta tags PWA
|   +-- vite.config.js         # Configuracao Vite + PWA
|   +-- Dockerfile             # Multi-stage build (Node + Nginx)
|   +-- nginx.conf             # Proxy reverso para API
|   +-- package.json
|
+-- docker-compose.yml         # Orquestracao backend + frontend
+-- uploads/                   # Armazenamento de midias (volume Docker)
+-- README.md
```

---

## Pre-requisitos

- **Docker** e **Docker Compose** (recomendado)

Ou, para execucao local:
- **Java 17+** (JDK)
- **Maven 3.9+**
- **Node.js 20.19+** e **npm**

---

## Como Executar

### Opcao 1: Docker Compose (Recomendado)

```bash
docker compose up --build
```

- **Frontend:** http://localhost
- **Backend:** http://localhost:8080
- **Swagger:** http://localhost:8080/swagger-ui/index.html

O Nginx do frontend faz proxy reverso automatico para a API (`/api/`) e uploads (`/uploads/`).

### Opcao 2: Execucao Local

**Backend:**

```bash
cd backend
mvn spring-boot:run
```

Backend disponivel em `http://localhost:8080`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend disponivel em `http://localhost:5173`.

> O Vite esta configurado com proxy reverso para `/api` apontando para `http://localhost:8080`.

---

## Endpoints da API

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/api/manifestacoes` | Registra nova manifestacao (retorna protocolo + senha) |
| `GET` | `/api/manifestacoes/{protocolo}?senha=` | Consulta manifestacao (requer senha) |
| `GET` | `/api/manifestacoes/{protocolo}/status-voz?senha=` | Resumo acessivel para leitura por voz |
| `GET` | `/api/manifestacoes/dashboard` | Dados consolidados para o painel do gestor |
| `GET` | `/api/manifestacoes/dashboard/kpis` | KPIs rapidos (total, urgencia, acessibilidade) |

### Campos do POST (multipart/form-data)

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `descricao` | String | Nao* | Texto da manifestacao (*obrigatorio se nenhuma midia for enviada) |
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
| Alto contraste | Modo preto/amarelo (ratio 19:1, WCAG AAA) ativavel pela barra |
| Controle de fonte | 3 niveis (100%, 120%, 140%) |
| Leitura por voz | Status do protocolo e dashboard lidos em portugues (Speech Synthesis) |
| Skip navigation | Link "Ir para o conteudo principal" no topo |
| Foco visivel | Outline em todos os elementos interativos (`:focus-visible`) |
| Labels e ARIA | `label`, `aria-label`, `aria-describedby`, `aria-live` |
| Fieldsets e Legends | Formularios agrupados semanticamente |
| Reducao de movimento | Respeita `prefers-reduced-motion` do sistema |
| Roles semanticos | `role="banner"`, `role="main"`, `role="contentinfo"`, `role="alert"`, `role="status"` |
| PWA | Instalavel na tela inicial, funciona offline |

---

## Integracao Tecnica

A solucao foi construida com as **tecnologias mais recentes do mercado** (React 19, Spring Boot 3, Tailwind CSS 4, Vite 7), seguindo uma arquitetura de API REST desacoplada. Isso garante **facil integracao com qualquer sistema externo**, incluindo:

- **LDAP / Active Directory** — autenticacao corporativa de gestores
- **SSO (Single Sign-On)** — integracao com portais governamentais
- **IA IZA** — sistema de inteligencia artificial da Ouvidoria-Geral do DF para transcricao de audio e classificacao automatica
- **PostgreSQL** — migracao direta do H2 para producao (basta trocar o datasource)
- **Barramento de servicos** — a API REST permite integracao via gateway ou message broker

---

## Criterios de Avaliacao Atendidos (Edital)

### P1 — Criterios de Entrega (10 pts)

| Criterio | Pontos | Status |
|---|---|---|
| Acessibilidade Digital (WCAG 2.1 AA) | 2,5 | Implementado (alto contraste AAA, fonte, teclado, voz, ARIA) |
| Multicanalidade (texto, audio, imagem, video) | 3 | Implementado (texto opcional, cada midia e canal autonomo) |
| Usabilidade e UX/UI | 3 | Implementado (wizard, barra progresso, feedback visual, design gov) |
| Integracao Tecnica com Participa DF | 1,5 | Arquitetura REST moderna, preparada para LDAP/SSO/IZA |

### P2 — Documentacao da Solucao (10 pts)

| Criterio | Pontos | Status |
|---|---|---|
| Qualidade do Codigo e Boas Praticas | 4 | Implementado (separacao clara, nomes significativos, tratamento de erro) |
| Logica e Funcionamento da Solucao | 3 | Implementado (fluxo completo com priorizacao e dashboard) |
| Instrucoes de Instalacao e Dependencias | 1 | Este README |
| Demonstracao da Solucao (video) | 1 | [Link acima] |
| Clareza e Organizacao do Projeto | 1 | Estrutura organizada (frontend/backend, components/services/context) |

---

## 📺 Pitch da Solução

[![Assista ao Vídeo do Pitch](https://img.youtube.com/vi/4QX7GZRb05Q/0.jpg)](https://www.youtube.com/watch?v=4QX7GZRb05Q)


---

## Uso de Inteligencia Artificial

Conforme item 13.9 do edital, declaramos o uso de IA no desenvolvimento:

- **Claude (Anthropic):** Auxiliou na revisao de codigo, correcao de bugs, melhoria de acessibilidade, migracao Tailwind v3 para v4, documentacao e boas praticas.

---

## Licenca

MIT

---

Desenvolvido para o 1o Hackathon em Controle Social: Desafio Participa DF — Conectando Governo e Cidadao (2026)
