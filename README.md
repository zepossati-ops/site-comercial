# Talentos & Oportunidades — ACE Pinhal

Site institucional do programa **Talentos & Oportunidades**, da ACE Pinhal, para apresentar os programas de Estágio e Aprendiz a empresas.

## Tecnologia

Site estático em HTML, CSS e JavaScript puros, sem frameworks e sem etapa de build. Basta abrir `index.html` no navegador ou publicar a pasta em um serviço como o GitHub Pages.

## Estrutura

```
index.html                  Página principal (todas as seções do site)
css/style.css                Estilos e paleta de cores
css/chat.css                 Estilos do widget de chat
js/script.js                 Menu mobile e ano do rodapé
js/chat.js                   Lógica do widget de chat (assistente de vendas)
cloudflare-worker/           Worker do Cloudflare que atende o chat (SYSTEM_PROMPT, modelo de IA)
api ace talentos/            Scripts e roteiros de teste do prompt do assistente (fora da publicação do site)
```

## Publicação

- Site publicado via GitHub Pages em https://zepossati-ops.github.io/site-comercial
- Worker do chat publicado em https://agente-vendas.site-pessoal.workers.dev — deploy com `npx wrangler deploy` dentro de `cloudflare-worker/`

## Pendências conhecidas

- Seção "Depoimentos" foi removida do site (menu e HTML) por falta de depoimentos reais de empresas — reavaliar quando houver conteúdo real.
- Faltam meta tags de compartilhamento social (Open Graph/Twitter Card), `robots.txt` e `sitemap.xml`.
