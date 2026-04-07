# ScaleFy

**ScaleFy** é um sistema de gerenciamento de campanhas, trackers e eventos para anúncios, com integração com Meta Ads, pixels e monitoramento de conversões. Permite criar trackers para cada anúncio, registrar clicks, eventos e gerar relatórios de performance.

---

## Tecnologias utilizadas

- **Backend:** Node.js, NestJS, Prisma, PostgreSQL
- **Cache / Eventos:** Redis
- **Frontend:** React, Next.js, React Native
- **Integrações externas:** Meta Ads API, Pixel Tracking, APIs de conversão de moeda, Email/SMS APIs
- **Outros:** Docker, Tailwind CSS, TypeScript

---

## Estrutura de dados principal

### Tenant (Usuário do sistema)

- `id`, `name`, `email`, `password`
- `trackers`: Trackers criados pelo usuário
- `metaConnections`: Contas conectadas da Meta
- `subscriptions`, `plans`, `notifications`, `apikeys`

### MetaConnection

- Conexão do usuário com a Meta (Facebook/Instagram)
- Contém `adAccounts` e `pixels`

### MetaAdAccount

- Representa uma conta de anúncios
- Contém `campaigns` e `pixels`

### Pixel

- Pixel do MetaAdAccount
- Pode ser usado por diversos AdSets e Ads
- Guardado com `externalId` e `metaPixelId`

### Campaign → AdSet → Ad

- **Campaign:** contém ad sets e ads
- **AdSet:** conjunto de anúncios dentro de uma campanha
- **Ad:** anúncio individual com `destinationUrl`, vinculado ao tracker

### Tracker

- Vinculado a um Ad
- Contém `funnelUrl`, `url` (único), `clicks` registrados

### Click

- Registrado ao visitar o Tracker
- Pode gerar diversos `Event`s

### Event

- Tipos: `PAGEVIEW`, `LEAD`, `PURCHASE`, `CLICK`, `ADDTOCART`, `DOWNLOAD`, `SUBSCRIPTION`, `INITIATECHECKOUT`
- Pode conter `revenue`, `currency`, `convertedRevenue`, `metadata`

### Notification

- Notificações para o Tenant
- Tipos: `PAYMENT`, `SYSTEM`, `ALERT`, `VISIT`

---

## Fluxo principal

1. Usuário cria **Tenant** e conecta sua **Meta Account**.
2. Usuário cria **Campaign / AdSet / Ad** na Meta.
3. Usuário cria **Tracker** no ScaleFy, vinculado ao Ad.
4. Quando um cliente clica no tracker:
   - Cria um `Click` com IP e metadata
   - Registra `Event`s de acordo com o comportamento (ex: PAGEVIEW, PURCHASE)
5. Admin pode definir taxas de conversão entre moedas e gerar relatórios de revenue
6. Sistema exibe dashboards com desempenho de campanhas, ads e sets
