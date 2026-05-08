@AGENTS.md

# CLAUDE.md — Contrato Arquitetural do Grid

> Leia este arquivo inteiro antes de qualquer tarefa. Ele define as regras que nunca devem ser quebradas.

## Visão Geral

**Grid** é um dashboard pessoal para acompanhar F1 e Futebol em tempo real.
Repositório: https://github.com/victorhugobraga/grid

### Stack

| Camada      | Tecnologia                           |
| ----------- | ------------------------------------ |
| Framework   | Next.js 16 (App Router + API Routes) |
| Linguagem   | TypeScript strict (sem `any`)        |
| Estilização | Tailwind CSS v4                      |
| Cache       | Upstash Redis via HTTP               |
| Validação   | Zod                                  |
| Testes      | Jest + ts-jest                       |
| Deploy      | Vercel Hobby                         |

### APIs Externas

| API           | Uso                                  | Rate Limit           |
| ------------- | ------------------------------------ | -------------------- |
| Jolpica-F1    | Calendário, standings, resultados F1 | 500 req/h            |
| OpenF1        | Telemetria detalhada de corridas     | Sem auth (histórico) |
| API-Football  | Jogos, standings, futebol geral      | 100 req/dia          |
| ESPN (hidden) | Fallback para futebol                | Não publicado        |

## Estrutura de Pastas

```
src/
├── app/
│   ├── (quick)/           # Visão rápida (New Tab / widget)
│   ├── (detail)/          # Visão detalhada com drill-down
│   │   ├── f1/            # Dashboard e detalhe de corridas F1
│   │   └── football/      # Dashboard e detalhe de partidas
│   └── api/               # API Routes
│       ├── health/        # Health check
│       ├── f1/            # Endpoints F1
│       └── football/      # Endpoints Futebol
├── components/
│   ├── ui/                # Primitivos: Button, Card, Badge...
│   └── features/          # Compostos: RaceCard, MatchCard, StandingsTable...
├── hooks/                 # React hooks: useStandings, useLiveScore...
├── lib/
│   ├── redis.ts           # Cliente Upstash
│   ├── cache.ts           # Helpers de cache (withCache, TTL)
│   ├── api.ts             # Helpers de resposta (ok, err, withHandler)
│   ├── errors.ts          # Classes de erro tipadas
│   ├── rate-limit.ts      # Rate limiting com @upstash/ratelimit
│   └── constants.ts       # IDs de ligas, pilotos/times favoritos
├── schemas/               # Zod schemas para validação
├── services/              # Lógica de negócio (sem Request/Response)
│   ├── f1.service.ts      # Busca dados F1 com cache
│   └── football.service.ts # Busca dados futebol com cache
└── types/
    ├── api.ts             # ApiResponse<T>, ApiError, ApiResult<T>
    ├── f1.ts              # F1Race, F1Standing, F1RaceResult...
    └── football.ts        # FootballMatch, FootballStanding...
```

## Padrão Obrigatório: Route Handler → Service → Cache → API Externa

**NUNCA coloque lógica de negócio direto na route.** Sempre siga:

```
Route Handler
└── chama Service
    ├── withCache(key, ttl, async () => {
    │   └── fetch API externa
    │   })
    └── retorna dado tipado

Route Handler
└── return ok(data) ou err(error)
```

### Exemplo correto

```ts
// ✅ route.ts — só orquestra
export const GET = withHandler(async () => {
  const { data, cachedAt } = await f1Service.getStandings();
  return ok(data, cachedAt);
});

// ✅ f1.service.ts — lógica aqui
async getStandings() {
  return withCache("f1:standings:2026", TTL.STANDINGS, async () => {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json");
    // parse e retorno...
  });
}
```

```ts
// ❌ NUNCA faça isso
export async function GET() {
  const res = await fetch("https://api.jolpi.ca/...");
  const data = await res.json();
  return Response.json(data); // sem cache, sem erro handling, sem tipos
}
```

## Convenções de Código

- **TypeScript strict**: nunca use `any`. Use `unknown` e type guards se necessário.
- **Imports**: sempre use `@/` (nunca `../../`)
- **Server Components**: padrão. Use `"use client"` só quando precisar de estado, evento ou browser API.
- **Tailwind**: nunca CSS-in-JS. Classes utilitárias no JSX.
- **Erros**: sempre lance `AppError` ou subclasses. Nunca `throw new Error()` genérico.
- **Nomes de arquivos**: `kebab-case` para arquivos, `PascalCase` para componentes.
- **Cache keys**: padrão `entidade:subtipo:identificador` (ex: `f1:standings:2026`, `football:matches:hoje`)

## TTLs de Cache

| Dado                      | TTL   | Razão                   |
| ------------------------- | ----- | ----------------------- |
| Calendário da temporada   | 24h   | Muda raramente          |
| Standings / classificação | 1h    | Atualiza após cada jogo |
| Fixtures do dia           | 30min | Horários são estáveis   |
| Placar ao vivo            | 60s   | Precisa ser fresco      |

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm run type-check   # verifica tipos sem compilar
npm run test         # roda os testes
npm run test:watch   # testes em modo watch
npm run format       # formata com Prettier
```

## Regras para IA (Claude Code)

1. **Leia este arquivo antes de qualquer tarefa**
2. **Sempre use o padrão Route Handler → Service → Cache**
3. **Nunca lógica de negócio direto na route**
4. **Todo service usa `withCache` — nunca chame API externa sem cache**
5. **Valide responses de APIs externas com Zod antes de retornar**
6. **Escreva testes para services antes de implementá-los (TDD)**
7. **Conventional commits obrigatórios**
8. **Nunca modifique este CLAUDE.md sem avisar o desenvolvedor**
