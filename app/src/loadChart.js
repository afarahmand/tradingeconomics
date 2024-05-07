import Chart from 'chart.js/auto';

(async function() {
  document.addEventListener("DOMContentLoaded", () => {
    // Free accounts only support Mexico, New Zealand, Sweden, and Thailand
    const countries = ["Mexico", "New Zealand", "Sweden", "Thailand"];

    // ToDo:
    // Move API KEY to ENV?
    // Tests?

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

async function fetchPopulationData(countries, apiKey) {
  // If I was making a production app, I wouldn't hard code 2024 here
  const response = await fetch(`https://api.tradingeconomics.com/historical/country/${countries}/indicator/population/1950-01-01/2024-12-31?c=${apiKey}`);
  return response.json();
}

function filterCountryRecords(apiResponse, country) {
  return apiResponse.filter(record => (record["Country"] === country));
}

function getCountryDataset(apiResponse, country) {
  let countryDataset = { label: country, data: [] };
  let countryRecords = filterCountryRecords(apiResponse, country);

  for (let i = 0; i < countryRecords.length; i++) {
    countryDataset["data"].push(countryRecords[i]["Value"])
  }

  return countryDataset;
}

function getCountryDatasets(apiResponse, countries) {
  let countryDatasets = [];

  for (let i = 0; i < countries.length; i++) {
    countryDatasets.push(getCountryDataset(apiResponse, countries[i]));
  }

  return countryDatasets;
}

function getYearsArray(apiResponse) {
  // Some countries don't have last year's data yet.  If at least one of the countries has last year's data, we want to make sure that last year displays on the x-axis even if other countries are missing data for that year
  const lastValidRecord = apiResponse[apiResponse.length - 2];
  const countryWithMostRecords = lastValidRecord["Country"];
  const countryRecords = filterCountryRecords(apiResponse, countryWithMostRecords);

  return countryRecords.map(record => (record["DateTime"].slice(0, 4)))
}
