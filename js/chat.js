// ============ PARTE PARA EDITAR ============
// Cole aqui a URL do seu Worker publicado no Cloudflare (ex.: "https://ace-talentos-chat.SEU-USUARIO.workers.dev")
const CHAT_API_URL = "https://SEU-WORKER.SEU-SUBDOMINIO.workers.dev";

// Mensagem exibida assim que o chat é aberto pela primeira vez
const MENSAGEM_BOAS_VINDAS = "Olá! Sou o assistente virtual do Talentos & Oportunidades. Posso te ajudar a conhecer os programas de Estágio e Aprendiz da ACE Pinhal. Como posso ajudar?";

// Mensagem exibida quando o assistente não consegue responder
const MENSAGEM_ERRO = "Não consegui responder agora. Fale com a nossa equipe pelo WhatsApp (19) 3661-9300 ou pelo e-mail acepinhal@yahoo.com.br.";
// ============ FIM DA PARTE PARA EDITAR ============

document.addEventListener("DOMContentLoaded", function () {
  var botao = document.getElementById("chatBotao");
  var painel = document.getElementById("chatPainel");
  var fechar = document.getElementById("chatFechar");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var mensagensEl = document.getElementById("chatMensagens");

  if (!botao || !painel || !form || !input || !mensagensEl) return;

  var historico = [];
  var carregando = false;
  var jaAbriu = false;

  function adicionarMensagem(texto, tipo) {
    var bolha = document.createElement("div");
    bolha.className = "chat-widget__mensagem chat-widget__mensagem--" + tipo;
    bolha.textContent = texto;
    mensagensEl.appendChild(bolha);
    mensagensEl.scrollTop = mensagensEl.scrollHeight;
  }

  function abrirChat() {
    painel.hidden = false;
    botao.setAttribute("aria-expanded", "true");
    if (!jaAbriu) {
      adicionarMensagem(MENSAGEM_BOAS_VINDAS, "bot");
      jaAbriu = true;
    }
    input.focus();
  }

  function fecharChat() {
    painel.hidden = true;
    botao.setAttribute("aria-expanded", "false");
    botao.focus();
  }

  botao.addEventListener("click", function () {
    if (painel.hidden) {
      abrirChat();
    } else {
      fecharChat();
    }
  });

  fechar.addEventListener("click", fecharChat);

  painel.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharChat();
    }
  });

  form.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    var texto = input.value.trim();
    if (!texto || carregando) return;

    adicionarMensagem(texto, "usuario");
    historico.push({ role: "user", content: texto });
    input.value = "";
    carregando = true;

    try {
      var resposta = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historico.slice(-10) }),
      });

      var dados = await resposta.json();

      if (!resposta.ok || dados.erro || !dados.resposta) {
        adicionarMensagem(MENSAGEM_ERRO, "erro");
      } else {
        adicionarMensagem(dados.resposta, "bot");
        historico.push({ role: "assistant", content: dados.resposta });
      }
    } catch (e) {
      adicionarMensagem(MENSAGEM_ERRO, "erro");
    } finally {
      carregando = false;
    }
  });
});
