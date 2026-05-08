# grid

Dashboard pessoal para acompanhar F1 e Futebol em tempo real.

## Stack

- Next.js 15 (App Router + API Routes)
- TypeScript strict
- Tailwind CSS v4
- Upstash Redis (cache)
- Vercel (deploy)

## Pré-requisitos

- Node 20+

## Como rodar

```bash
cp .env.example .env.local

# preencha as variáveis no .env.local

npm install
npm run dev
```

## Scripts

| Comando              | O que faz                            |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Inicia o servidor de desenvolvimento |
| `npm run build`      | Gera o build de produção             |
| `npm run test`       | Roda os testes                       |
| `npm run type-check` | Verifica tipos TypeScript            |
| `npm run format`     | Formata o código com Prettier        |

## Estrutura

```
src/
├── app/ # App Router (páginas e API Routes)
├── components/ # Componentes React
├── hooks/ # React hooks customizados
├── lib/ # Clientes e utilitários (redis, etc)
├── schemas/ # Schemas Zod
├── services/ # Lógica de negócio
└── types/ # TypeScript types
```

## Commits

Projeto usa Conventional Commits:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `chore:` manutenção
- `docs:` documentação
- `refactor:` refatoração sem mudança de comportamento
- `test:` testes
