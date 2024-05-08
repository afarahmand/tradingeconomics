import Chart from 'chart.js/auto';
import {
  fetchPopulationData,
  filterCountryRecords,
  getCountryDataset,
  getCountryDatasets,
  getYearsArray
} from './helpers.js';

(async function() {
  document.addEventListener("DOMContentLoaded", () => {
    // Free accounts only support Mexico, New Zealand, Sweden, and Thailand
    const countries = ["Mexico", "New Zealand", "Sweden", "Thailand"];

    // ToDo:
    // Move API KEY to ENV?

    // fetchPopulationData(countries.join(", "), "placeholder_api_key").then(
      apiResponse => {
        new Chart(
          document.getElementById('chart-container'),
          {
            type: 'line',
            data: {
              labels: getYearsArray(apiResponse),
              datasets: getCountryDatasets(apiResponse, countries)
            },
            options: {
              title: {
                display: true,
                fontSize: 32,
                text: 'Population by Year'
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Year'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Population [Millions]'
                  }
                }
              }
            }
          }
        );
      }
    ).catch(
      error => {
        console.error(error);
        const errorDisplayElement = document.getElementById('error-message');
        errorDisplayElement.innerHTML = `${error}`;
      }
    )
  });
})();
