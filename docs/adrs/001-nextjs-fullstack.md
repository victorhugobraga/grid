# ADR-001: Next.js como framework fullstack

## Status: Aceito

## Contexto

Dashboard pessoal para um único usuário, sem necessidade de escalar independentemente frontend e backend.

## Decisão

Usar Next.js 16 com App Router e API Routes como solução fullstack única, deploy na Vercel.

## Consequências

- ✅ Um único repositório, um único deploy
- ✅ TypeScript compartilhado entre frontend e backend
- ✅ Vercel otimizado para Next.js (Edge, ISR, caching nativo)
- ⚠️ Funções serverless têm timeout de 10s (Hobby) — serviços pesados precisam de cache
