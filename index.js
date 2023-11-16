let controller = {
    data: null,
    get message(){
        if (!this.data){
            return `não tem dados`;   
        }
        let last = this.data[this.data.length -1];
        console.log(last);
        return `corrente: ${last.corrente}\n potencia: ${last.potencia}`;
    }   
};

document.addEventListener("DOMContentLoaded", function () {
    if ('WebSocket' in window) {
        // O navegador suporta WebSocket
        let webSocket = new WebSocket("ws://192.168.43.100:81/");
       
        webSocket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (!controller.data){
                controller.data = [];
            }
            controller.data.push(data);

            console.table(controller.data, ["corrente", "potencia"]);
          };
          
  
            webSocket.addEventListener('open', function (event) {
            console.log("Conexão WebSocket aberta");
  
            // Adicione a lógica de enviar comandos quando os botões são clicados
            document.getElementById("btn-ligar").addEventListener("click", function () {
                enviarComando("L");
            });
  
            document.getElementById("btn-desligar").addEventListener("click", function () {
                enviarComando("D");
            });
  
            document.getElementById("btn-verificarconsumo").addEventListener("click", function () {
                alert(controller.message);
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
  
  // Função para processar as mensagens recebidas do Arduino
  function processarMensagem(mensagem) {
    // Converta a mensagem para um objeto JSON
    var dados = JSON.parse(mensagem);
  
    // Atualize o estado do relé
    if (dados.ligado) {
      document.getElementById("status-rele").textContent = "Ligado";
    } else {
      document.getElementById("status-rele").textContent = "Desligado";
    }
  
    // Atualize o consumo de energia
    document.getElementById("consumo-energia").textContent = dados.consumo;
  }
  
  // Adicione um manipulador de eventos para mensagens recebidas
  webSocket.onmessage = processarMensagem;
  








