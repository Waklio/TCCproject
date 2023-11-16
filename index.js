document.addEventListener("DOMContentLoaded", function () {
  if ('WebSocket' in window) {
      // O navegador suporta WebSocket
      var webSocket = new WebSocket("ws://192.168.1.4:81/");

      webSocket.addEventListener('open', function (event) {
          console.log("Conexão WebSocket aberta");

          // Adicione a lógica de enviar comandos quando os botões são clicados
          document.getElementById("btn-ligar").addEventListener("click", function () {
              enviarComando("L");
          });

          document.getElementById("btn-desligar").addEventListener("click", function () {
              enviarComando("D");
          });

          function enviarComando(comando) {
              webSocket.send(comando);
          }
      });

      webSocket.addEventListener('close', function (event) {
          console.log("Conexão WebSocket fechada");
      });

      webSocket.addEventListener('error', function (event) {
          console.error("Erro WebSocket:", event);
      });

  } else {
      // O navegador não suporta WebSocket
      console.error("Seu navegador não suporta WebSocket.");
  }
});









