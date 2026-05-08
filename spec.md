# Grid — Fase 1: Isolamento e Governança

Você está ajudando a finalizar a Fase 1 (Isolamento e Governança) do projeto `grid`.

## Contexto do projeto

- Dashboard pessoal para acompanhar F1 e Futebol (Brasileirão, Libertadores, Champions, Copa do Mundo)
- Stack: Next.js 15 + TypeScript + Tailwind CSS + App Router
- SEM banco de dados, SEM autenticação
- Cache com Upstash Redis (HTTP)
- Deploy na Vercel

## O que JÁ foi feito

- `npx create-next-app@latest` com TypeScript, Tailwind, ESLint, App Router, src-dir, import alias @/\*
- Dependências instaladas: @upstash/redis @upstash/ratelimit swr zod recharts
- Dependências de dev instaladas: jest @types/jest ts-jest

## O que FALTA fazer (execute na ordem)

### 1. Criar estrutura de pastas

Crie os seguintes diretórios dentro de `src/`:

- src/services/
- src/schemas/
- src/types/
- src/lib/
- src/hooks/

Coloque um arquivo `.gitkeep` em cada um para o git rastrear as pastas vazias.

### 2. Criar arquivos de configuração

**.nvmrc** na raiz:

```
20
```

**.editorconfig** na raiz:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

**.env.example** na raiz:

```bash
# Upstash Redis (pega no upstash.com)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# API-Football (pega no api-football.com)
API_FOOTBALL_KEY=

# Ambiente
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Crie também o **.env.local** copiando o conteúdo do .env.example (os valores ficam vazios por enquanto).

### 3. Configurar Jest para TypeScript

Crie **jest.config.ts** na raiz:

```ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
};

export default config;
```

Crie a pasta `__tests__/` na raiz com um arquivo `.gitkeep`.

### 4. Configurar scripts no package.json

Adicione/atualize os scripts:

```json
"format": "prettier --write .",
"type-check": "tsc --noEmit",
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

### 5. Configurar governança de commits

Instale as dependências:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional husky lint-staged prettier
```

Inicialize o Husky:

```bash
npx husky init
```

Crie **commitlint.config.js** na raiz:

```js
module.exports = { extends: ["@commitlint/config-conventional"] };
```

Atualize **.husky/commit-msg** para conter:

```
npx --no -- commitlint --edit $1
```

Atualize **.husky/pre-commit** para conter:

```
npx lint-staged
```

Adicione no **package.json** (fora de scripts, no nível raiz do objeto):

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### 6. Criar src/lib/redis.ts

```ts
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();
```

### 7. Atualizar .gitignore

Garanta que o .gitignore inclua:

```
# env
.env
.env.local
.env*.local

# next
.next/
out/

# deps
node_modules/

# coverage
coverage/

# os
.DS_Store
Thumbs.db
```

### 8. Atualizar README.md

Substitua o conteúdo do README.md por:

```md
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

\`\`\`bash
cp .env.example .env.local

# preencha as variáveis no .env.local

npm install
npm run dev
\`\`\`

## Scripts

| Comando              | O que faz                            |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Inicia o servidor de desenvolvimento |
| `npm run build`      | Gera o build de produção             |
| `npm run test`       | Roda os testes                       |
| `npm run type-check` | Verifica tipos TypeScript            |
| `npm run format`     | Formata o código com Prettier        |

## Estrutura

\`\`\`
src/
├── app/ # App Router (páginas e API Routes)
├── components/ # Componentes React
├── hooks/ # React hooks customizados
├── lib/ # Clientes e utilitários (redis, etc)
├── schemas/ # Schemas Zod
├── services/ # Lógica de negócio
└── types/ # TypeScript types
\`\`\`

## Commits

Projeto usa Conventional Commits:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `chore:` manutenção
- `docs:` documentação
- `refactor:` refatoração sem mudança de comportamento
- `test:` testes
```

### 9. Validação final

Após tudo configurado, rode:

```bash
npm run dev
npm run type-check
```

Ambos devem rodar sem erros. Reporte o resultado de cada um.
