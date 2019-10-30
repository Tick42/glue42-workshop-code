window.applicationName = 'Vanilla Client Portfolio';
const defaultInstrument = 'BARC.L';

function displayChart(instrument) {
  Highcharts.getJSON(
    `./data/${instrument}.json`,
    function(data) {
      // create the chart
      Highcharts.stockChart("container", {
        rangeSelector: {
          selected: 1
        },

        title: {
          text: `${instrument} Stock Price`
        },

        series: [
          {
            type: "candlestick",
            name: `${instrument} Stock Price`,
            data: data,
            dataGrouping: {
              units: [
                [
                  "week", // unit name
                  [1] // allowed multiples
                ],
                ["month", [1, 2, 3, 4, 6]]
              ]
            }
          }
        ]
      });
    }
  );
}

function setTitle(instrument) {
  document.querySelector('#title-name').innerText = instrument;
}

(async function init() {
  displayChart(defaultInstrument);
  setTitle(defaultInstrument);
})();