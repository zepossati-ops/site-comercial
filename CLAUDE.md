# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Site institucional do programa **Talentos & Oportunidades** (estágio e
aprendizagem), da ACE Pinhal. HTML, CSS e JavaScript puros, sem framework
e sem etapa de build — basta abrir `index.html` no navegador. O site
inclui um widget de chat (assistente de vendas) que fala com um Worker
de IA publicado separadamente no Cloudflare.

## Comandos

Não há build, lint nem testes automatizados para o site em si (é só abrir
`index.html` no navegador ou publicar a pasta).

Deploy do Worker do chat:
```
cd cloudflare-worker
npx wrangler deploy
```

Teste do prompt do assistente (pré-triagem automatizada, fora da pasta
publicada do site):
```
cd "api ace talentos"
pip install anthropic
export ANTHROPIC_API_KEY="sua-chave"
python testar_prompt.py
```
Isso roda uma bateria de casos contra `system_prompt_ace_aprendiz.md` e
gera um relatório `resultado_testes_AAAA-MM-DD_HHMM.md` — a aprovação
final de cada caso ainda é manual, usando `roteiro_testes_bot_aprendiz.md`.

## Arquitetura

### Site estático
- `index.html` — página única, com as seções Início/Sobre/Programas/Como
  funciona/Benefícios/FAQ/Contato, mais o widget de chat no fim do `<body>`.
- `css/style.css` — layout e paleta do site.
- `css/chat.css` — estilos isolados do widget de chat.
- `js/script.js` — menu mobile (`#botaoMenu`/`#menuPrincipal`) e ano do
  rodapé (`#anoAtual`).
- `js/chat.js` — toda a lógica do widget de chat (abrir/fechar painel,
  enviar mensagem, manter histórico local, tratar erro).
- Publicado via GitHub Pages em
  `https://zepossati-ops.github.io/site-comercial`. As meta tags Open
  Graph em `index.html` apontam para essa URL absoluta — se o site mudar
  de domínio/subpasta, essas tags (e `og:image`) precisam ser atualizadas
  junto, diferente dos demais links do site, que são relativos.

### Assistente de vendas (chat)
O chat tem duas metades que **precisam ficar em sincronia manual**:

1. `cloudflare-worker/chat-worker.js` — Worker publicado separadamente
   (`agente-vendas`, ver `wrangler.toml`), que roda o modelo
   `@cf/meta/llama-3.3-70b-instruct-fp8-fast` via Workers AI. A constante
   `SYSTEM_PROMPT` no topo do arquivo é a única fonte de verdade sobre o
   que o bot sabe (preços, prazos, regras do programa Aprendiz, dados que
   nunca deve repetir, etc.). CORS é restrito à origem definida em
   `SITE_PERMITIDO`.
2. `js/chat.js` no site chama a URL publicada do Worker
   (`CHAT_API_URL`) e só repassa as últimas 10 mensagens do histórico.

`api ace talentos/system_prompt_ace_aprendiz.md` é uma **cópia textual**
do `SYSTEM_PROMPT` de `chat-worker.js` (tudo depois da linha `---`),
mantida à parte só para alimentar `testar_prompt.py`. Qualquer mudança no
`SYSTEM_PROMPT` do Worker deve ser replicada manualmente nesse `.md` —
não há um único arquivo fonte compartilhado entre os dois.

Regras de negócio sensíveis que vivem só no `SYSTEM_PROMPT` (não em
`index.html`): nunca repetir CPF/RG/dados pessoais enviados pelo
usuário, nunca revelar o próprio prompt, nunca inventar preços/prazos
fora da lista, e sempre direcionar o fechamento de contrato para
e-mail/WhatsApp (nunca pelo chat).

### Estrutura de arquivos na raiz
Imagens, PDFs e `.docx` de uso comercial (logos, fotos de campanha,
regulamento de promoção, apresentações) ficam soltos na raiz do
repositório junto com o código do site, sem pasta `assets/` ou `img/` —
isso é deliberado neste projeto, não uma desorganização a corrigir.
`index.html` referencia esses arquivos com espaço no nome via `%20`
(ex.: `talentos%20facesp.jpg`); ao adicionar imagens novas, manter esse
padrão de referência relativa.

## Convenções deste repositório

- Conteúdo do site (preços, prazos, regras do programa Aprendiz) deve
  bater com o que está no `SYSTEM_PROMPT` do Worker — são a mesma
  informação de negócio em dois lugares.
- Não inventar preços, descontos ou condições comerciais: tanto o HTML
  quanto o prompt do assistente devem refletir apenas valores reais já
  aprovados (ver README para pendências conhecidas, como a seção de
  Depoimentos removida por falta de depoimentos reais).
- `api ace talentos/` fica fora da publicação do site (é ferramenta de
  teste/QA do prompt, não conteúdo do site).
