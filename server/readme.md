# ScaleFy Server

O **ScaleFy Server** é o núcleo da plataforma, responsável por processamento de eventos, rastreamento de campanhas, gerenciamento de dados e exposição de APIs para integração com frontends e scripts de tracking.

A arquitetura foi pensada para **escala, flexibilidade e baixo acoplamento**, permitindo evolução contínua sem travar decisões tecnológicas.

---

## 🧠 Responsabilidades do Backend

O servidor é responsável por:

- Gerenciar tenants (usuários e planos)
- Criar e organizar campanhas e trackers
- Registrar cliques e gerar `clickId`
- Receber e processar eventos em tempo real
- Calcular métricas e conversões
- Garantir integridade e rastreabilidade dos dados

---

## 🏗️ Arquitetura

O projeto segue uma estrutura baseada em princípios de **Clean Architecture + Repository Pattern**, com separação clara de responsabilidades:
src/
├── domain/
├── app/
├── infra/
├── core/

### 🔹 Domain

- Entidades e regras de negócio puras
- Nenhuma dependência externa

### 🔹 Application

- Casos de uso (services)
- Orquestra regras do domínio

### 🔹 Infra
- Implementações concretas (Prisma, Redis, etc.)
- Repositórios e integrações externas
- EmailService
- GetawayPaymentService
- ScheduleService (Cron Jobs)

### 🔹 HTTP
- Controllers
- DTOs e validações
- Guards
- Pipes
- Decorators

---

## 🧱 Tecnologias

- **Runtime:** Node.js
- **Framework:** NestJS
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Cache / Eventos:** Redis
- **Documentação:** Swagger
- **Containerização:** Docker

---

## 🗄️ Banco de Dados

O projeto utiliza **PostgreSQL** com **Prisma ORM**, garantindo:

- Tipagem forte
- Migrations controladas
- Facilidade de manutenção

### 🔄 Flexibilidade

O uso de **Repository Pattern** desacopla o ORM da aplicação.

Isso permite:

- Trocar o Prisma futuramente
- Usar outro banco de dados
- Reduzir dependência da camada de infraestrutura

---

## 🔄 Fluxo de Tracking (Backend)

### 1. Acesso ao Tracker

- Recebe uma `key`
- Busca o tracker
- Gera um `clickId`
- Registra um **Click**

### 2. Processamento de Eventos

- Recebe eventos via API
- Valida `clickId`
- Associa evento ao click
- Persiste dados (revenue, metadata, etc.)

### 3. Enriquecimento de Dados

- Captura:
  - IP
  - User-Agent
  - Timestamp

---

## 📡 API & Documentação

A API é documentada com **Swagger**.
Acesse: /docs

Funcionalidades:

- Listagem de endpoints
- Estrutura de requisições e respostas
- Testes interativos

---

## ⚙️ Padrões Utilizados

- Repository Pattern
- Dependency Injection (NestJS)
- DTO Validation
- Separation of Concerns
- Modular Architecture

---

## ⚠️ Pontos Críticos

- Latência no redirecionamento do tracker
- Perda de eventos (frontend → backend)
- Bloqueios por AdBlock
- Consistência entre Click e Event
- Alta concorrência em escrita

---

## 🔐 Variáveis de Ambiente

Exemplo de `.env`:

```env
# App
PORT=3000
DATABASE_URL=""
SECRET_KEY=""
SECRET_KEY_RESET=""
API_RESEND_KEY=""
PLINKPAY_API_KEY=""
ADMIN_EMAIL=""
ADMIN_PASSWORD=""

## Example .env ##
```
▶️ Rodando o projeto
pnpm install && pnpm migrate && pnpm dev