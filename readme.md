# ScaleFy

**ScaleFy** é uma plataforma de rastreamento e análise de campanhas que permite criar, gerenciar e otimizar funis de marketing através de trackers inteligentes e monitoramento de eventos em tempo real.

Diferente de ferramentas dependentes de plataformas externas, o ScaleFy oferece um sistema independente onde o próprio usuário define suas campanhas, trackers e coleta de dados.

---

## 🚀 Proposta

O ScaleFy permite que qualquer usuário:

- Crie campanhas manualmente
- Gere links rastreáveis (trackers)
- Monitore cliques e comportamento do usuário
- Capture eventos como leads, vendas e pageviews
- Analise performance de funis sem depender de terceiros

Se o funil tiver o script instalado, os dados são enviados automaticamente para o sistema.

---

## 🧱 Tecnologias

- **Backend:** Node.js, NestJS, Prisma, PostgreSQL  
- **Cache & Eventos:** Redis  
- **Frontend:** React, Next.js, React Native  
- **Infraestrutura:** Docker  
- **Linguagem:** TypeScript  

---

## 🧩 Estrutura principal

### Tenant (Usuário)

- Gerencia sua conta e plano (free ou pago)
- Possui campanhas, trackers e eventos

---

### Campaign

- Criada manualmente pelo usuário
- Contém:
  - `name`
  - `funnelUrl`
  - `description` (opcional)
- Agrupa trackers

---

### Tracker

- Gerado a partir de uma campanha
- Contém:
  - `key` (identificador único)
  - `url` (link rastreável)
  - `funnelUrl` associado
- Responsável por iniciar o rastreamento

---

### Click

- Criado ao acessar um tracker
- Contém:
  - `clickId`
  - IP, user-agent, metadata
- Serve como base para eventos

---

### Event

Eventos capturados a partir do comportamento do usuário:

- `PAGEVIEW`
- `CLICK`
- `LEAD`
- `PURCHASE`
- `ADDTOCART`
- `INITIATECHECKOUT`
- `DOWNLOAD`
- `SUBSCRIPTION`

Pode conter:

- `revenue`
- `currency`
- `convertedRevenue`
- `metadata`

---

## 🔄 Fluxo do sistema

1. Usuário cria conta e escolhe um plano (free ou pago)
2. Cria uma **Campaign** manualmente informando:
   - Nome
   - Funnel URL
3. Cria um **Tracker**
4. O sistema gera uma URL com uma `key` única
5. Usuário usa essa URL nos seus anúncios ou tráfego

---

### 🔗 Quando alguém acessa o tracker:

- O sistema:
  - Identifica a `key`
  - Gera um `clickId`
  - Registra um **Click**

---

### 📡 Se o funil tiver o script instalado:

- O frontend envia eventos para a API
- Eventos são associados ao `clickId`
- O sistema registra ações como:
  - Visualização de página
  - Leads
  - Compras

---

## 📊 Análise e métricas

O ScaleFy permite:

- Visualizar performance por campanha
- Analisar conversões por tracker
- Medir revenue (com conversão de moeda)
- Entender o comportamento do usuário no funil

---

## ⚠️ Considerações

O ScaleFy funciona como um sistema independente de tracking, o que implica desafios importantes como:

- Precisão na captura de eventos
- Bloqueios por adblockers
- Atribuição de conversões
- Latência no redirecionamento

Esses fatores devem ser considerados na evolução do sistema.

---

## 🔮 Possíveis evoluções

- Sistema de atribuição (first-click / last-click)
- A/B testing de funis
- Rotação de tráfego (split)
- Webhooks para integrações externas
- Integração com canais como email e WhatsApp
- Relatórios avançados e dashboards inteligentes
