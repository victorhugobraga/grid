# ADR-004: Jolpica-F1 como fonte principal de F1

## Status: Aceito

## Contexto

A Ergast API foi descontinuada no fim de 2024. Precisava de um substituto com calendário, standings e resultados históricos.

## Decisão

Jolpica-F1 é um drop-in replacement da Ergast, com os mesmos endpoints e schema, ativo e mantido pela comunidade.

## Consequências

- ✅ Mesma API da Ergast — documentação e tutoriais antigos funcionam
- ✅ Rate limit confortável: 4 req/s, 500 req/h
- ✅ Calendário 2026 já populado
- ⚠️ Projeto comunitário — sem SLA formal
