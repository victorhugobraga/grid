# ADR-002: Upstash Redis para cache

## Status: Aceito

## Contexto

APIs externas têm rate limits apertados (100 req/dia na API-Football). Funções serverless não mantêm estado entre invocações.

## Decisão

Usar Upstash Redis via HTTP como camada de cache compartilhada e persistente entre deploys e cold starts.

## Consequências

- ✅ Funciona em Edge e Node runtime (HTTP, sem TCP)
- ✅ Free tier: 500k comandos/mês — suficiente para uso pessoal
- ✅ Resolve cold start sem estado
- ⚠️ Latência levemente maior que Redis TCP (~10ms extra)
