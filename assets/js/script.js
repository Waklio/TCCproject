const btnON = document.getElementById("btn-ON"),
  btnOFF = document.getElementById("btn-OFF"),
  btnVERIFY = document.getElementById("btn-VERIFY");

const urlServer = "ws://10.0.0.183:81";
const browserSupportsWebsocket = "WebSocket" in window;

let controller = {
  relayState: null,
  data: null,
  get lastDataIndex() {
    if (!this.data) {
      return 0;
    }

    return this.data.length - 1;
  },
  get lastData() {
    return this.data[this.lastDataIndex];
  },
  get message() {
    if (!this.data) {
      return `não tem dados`;
    }
    return `Corrente: ${this.lastData.eletricCurrent} A \n Potência: ${this.lastData.eletricPower} W`;
  },
};

let chartLabels = [];
let eletricPowerData = [];
let chartData = {
  labels: chartLabels,
  datasets: [
    {
      label: "Potência em W",
      data: eletricPowerData,
      borderColor: "#d40e0e",
      backgroundColor: "#d40e0e50",
    },
  ],
};

const config = {
  type: "line",
  data: chartData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Consumo",
      },
    },
  },
};
const ctx = document.getElementById("chart-consumption");
let chart = new Chart(ctx, config);

function addToChart(chart, label, value) {
  chart.data.labels.push(label);
  chart.data.datasets[chart.data.datasets.length - 1].data.push(value);
  chart.update();
}

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

    addToChart(
      chart,
      controller.lastDataIndex,
      controller.lastData.eletricPower
    );

    console.log("status do relé: " + controller.relayState);
    console.table(controller.data, ["eletricCurrent", "eletricPower"]);
  };

  connection.addEventListener("open", function (event) {
    console.info("Conexão WebSocket aberta");

    btnON.onclick = (event) => sendRequest("L");

    btnOFF.onclick = (event) => sendRequest("D");

    /*btnVERIFY.onclick = (event) => scrollIntoView.(
      behavior: "smooth"
    );*/
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
