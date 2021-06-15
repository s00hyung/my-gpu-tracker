let Colors = {};
Colors.names = {
  black: "#000000",
  blue: "#0000ff",
  brown: "#a52a2a",
  green: "#008000",
  orange: "#ffa500",
  pink: "#ffc0cb",
  purple: "#800080",
  red: "#ff0000",
  yellow: "#ffff00",
};

Colors.random = function () {
  var result;
  var count = 0;
  for (var prop in this.names) if (Math.random() < 1 / ++count) result = prop;
  return result;
};

var res;
var requestURL = "https://gpu-price-tracker-api.herokuapp.com/gpus";
var request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();
request.onload = function () {
  res = request.response.body;
  console.log;
  var title;
  var labels = [];
  var datasets = [];

  for (const price of res[0]["price_data"]) {
    labels.push(price["date"]);
  }

  for (const gpu of res) {
    var gpu_label = gpu["name"];
    var price_data = [];
    let date = new Date(gpu["price_last_updated"]);
    title =
      date.getFullYear() +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + date.getDate()).slice(-2) +
      " " +
      ("0" + date.getHours() + 1).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ":" +
      ("0" + date.getSeconds()).slice(-2);

    for (const price of gpu["price_data"]) {
      price_data.push(price["value"]);
    }
    datasets.push({
      label: gpu_label,
      data: price_data,
      fill: false,
      borderColor: Colors.random(),
      tension: 0.1,
    });
  }
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: false,
      scales: {
        y: {
          max: 5000000,
          min: 0,
          ticks: {
            stepSize: 500000,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Last Updated: ${title}`,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = `${context.dataset.label}: ${context.parsed.y}`;
              return label;
            },
          },
        },
      },
    },
  });
};
