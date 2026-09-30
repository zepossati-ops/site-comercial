// Menu mobile: abre e fecha a navegação principal
document.addEventListener("DOMContentLoaded", function () {
  var botaoMenu = document.getElementById("botaoMenu");
  var menuPrincipal = document.getElementById("menuPrincipal");

  if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", function () {
      var aberto = menuPrincipal.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
    });

    menuPrincipal.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuPrincipal.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  var anoAtual = document.getElementById("anoAtual");
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }
});
