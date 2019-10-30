window.applicationName = 'Vanilla Client Portfolio';
import { initializeInterop } from './glue-related.js';
const defaultInstrument = 'BARC.L';

function displayChart(instrument) {
  console.log(`INSTRUMENT: ${instrument}`);
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

function ensureTickerCompat(ticker) {
  return ticker.replace(/:LN$/, '.L')
          .replace(/:US$/, '')
          .replace(/^GOOGL$/, 'GOOG')
          .replace(/:GR$/, '.DE');
}

function displayTickerChart(ticker) {
  const compatibleTicker = ensureTickerCompat(ticker);
  console.log(compatibleTicker);
  displayChart(compatibleTicker);
}

(async function init() {
  displayChart(defaultInstrument);
  setTitle(defaultInstrument);
  initializeInterop(displayTickerChart);
})();