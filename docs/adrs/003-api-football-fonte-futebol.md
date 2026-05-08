# ADR-003: API-Football como fonte principal de futebol

## Status: Aceito

## Contexto

Não existe API oficial pública da CBF, Conmebol ou UEFA. Avaliei: SportMonks, football-data.org, TheSportsDB, ESPN hidden, API-Football.

## Decisão

API-Football como fonte principal (100 req/dia free, cobre Brasileirão + Libertadores + Champions + Copa do Mundo no mesmo schema). ESPN hidden como fallback.

## Consequências

- ✅ Cobertura completa das ligas desejadas em uma única API
- ✅ Schema consistente entre ligas
- ⚠️ 100 req/dia exige cache agressivo (obrigatório)
- ⚠️ ESPN hidden é não-oficial — pode mudar sem aviso
