# 🏛️ Participa DF - Sistema de Ouvidoria (Backend)

Este repositório contém o backend do projeto desenvolvido para o **1º Hackathon da Controladoria-Geral do Distrito Federal (CGDF)**. O objetivo é fornecer uma API robusta e acessível para o registro de manifestações (reclamações, denúncias, sugestões e elogios).

## 🚀 Tecnologias Utilizadas
* **Java 21** & **Spring Boot 3**
* **Spring Data JPA** & **H2 Database** (Persistência rápida para Hackathon)
* **Lombok** (Produtividade no código)
* **SpringDoc OpenAPI (Swagger)** (Documentação da API)
* **Multipart Storage** (Tratamento de mídias: Áudio, Vídeo e Imagem)

## 📋 Requisitos Atendidos (Categoria Ouvidoria)
- [x] **Envio de Mídias:** Suporte a texto, áudio, imagem e vídeo.
- [x] **Anonimato:** Opção de registro anônimo garantindo a privacidade do cidadão.
- [x] **Protocolo Automático:** Geração de protocolo único (Ex: `PROT-2026XXXXXX`).
- [x] **Acessibilidade (Backend-ready):** Respostas JSON padronizadas e suporte a mídias para facilitar o uso de leitores de tela no PWA.

## 🛠️ Como Executar o Projeto
1. Certifique-se de ter o **JDK 21** e o **Maven** instalados.
2. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/cg-ouvidoria.git](https://github.com/seu-usuario/cg-ouvidoria.git)
   ```
3. Execute a aplicação:

```
Bash

mvn spring-boot:run
```
4. A API estará disponível em: http://localhost:8080

## 📖 Documentação (Swagger)
Para facilitar a integração com o Frontend (PWA), a documentação completa dos endpoints pode ser acessada em: 👉 http://localhost:8080/swagger-ui/index.html

## 📁 Estrutura de Endpoints Principais
POST `/api/manifestacoes`: Registra uma nova manifestação (recebe multipart/form-data).

GET `/api/manifestacoes/{protocolo}`: Consulta o status e detalhes de uma manifestação.

---
Desenvolvido para o Hackathon Participa DF 2026