const btnON = document.getElementById("btn-ON"),
  btnOFF = document.getElementById("btn-OFF"),
  btnVERIFY = document.getElementById("btn-VERIFY");

const urlServer = "ws://192.168.43.100:81";
const browserSupportsWebsocket = "WebSocket" in window;

let controller = {
  relayState: null,
  data: null,
  get message() {
    if (!this.data) {
      return `não tem dados`;
    }

    let last = this.data[this.data.length - 1];

    return `Corrente: ${last.eletricCurrent} A \n Potência: ${last.eletricPower} W`;
  },
};

if (browserSupportsWebsocket) {
  let connection = new WebSocket(urlServer);

  function sendRequest(comando) {
    connection.send(comando);
  }

  connection.onmessage = (event) => {
    let message = JSON.parse(event.data);

    if (!controller.data) {
      controller.data = [];
    }

    controller.data.push(message.data);
    controller.relayState = message.relayState;

    console.log("status do relé: " + controller.relayState);
    console.table(controller.data, ["eletricCurrent", "eletricPower"]);
  };

  connection.addEventListener("open", function (event) {
    console.info("Conexão WebSocket aberta");

    btnON.onclick = (event) => sendRequest("L");

    btnOFF.onclick = (event) => sendRequest("D");

    btnVERIFY.onclick = (event) => alert(controller.message);
  });

  connection.addEventListener("close", function (event) {
    console.warn("Conexão WebSocket fechada");
  });

  connection.addEventListener("error", function (event) {
    console.error("Erro WebSocket:", event);
  });
} else {
  console.error("Seu navegador não suporta WebSocket.");
}
