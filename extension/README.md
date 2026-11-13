# Extensão de Nova Guia

1. Edite `newtab.html` e troque o `src` do iframe pela URL de produção.
2. Abra `chrome://extensions`, ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e selecione esta pasta.

O site precisa permitir ser embutido: `next.config.ts` envia
`Content-Security-Policy: frame-ancestors 'self' chrome-extension:`.
