import Chart from 'chart.js/auto';

(async function() {
  document.addEventListener("DOMContentLoaded", () => {
    // Free accounts only support Mexico, Sweden, Thailand, New Zealand
    const countries = ["Mexico", "New Zealand", "Sweden", "Thailand"];

    // ToDo:
    // Move API KEY to ENV?
    // Handle API error
    // Refactor maybe into separate files
    // Tests?

    // getPopulationData(countries.join(", "), "placeholder_api_key").then(
      apiResponse => {
        new Chart(
          document.getElementById('acquisitions'),
          {
            type: 'line',
            data: {
              labels: getYears(apiResponse),
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
        console.log("API Error!");
        console.log(error);
      }
    )
  });
})();

function getCountryDatasets(apiResponse, countries) {
  let countryDataset, countryRecords;
  let countryDatasets = [];

  for (let i = 0; i < countries.length; i++) {
    countryDataset = { label: countries[i], data: [] };
    countryRecords = getCountryRecords(apiResponse, countries[i]);

    for (let j = 0; j < countryRecords.length; j++) {
      countryDataset["data"].push(countryRecords[j]["Value"])
    }

    countryDatasets.push(countryDataset);
  }

  return countryDatasets;
}

function getCountryRecords(apiResponse, country) {
  return apiResponse.filter(record => (record["Country"] === country));
}

async function getPopulationData(countries, apiKey) {
  const response = await fetch(`https://api.tradingeconomics.com/historical/country/${countries}/indicator/population/1950-01-01/2024-12-31?c=${apiKey}`);
  return response.json();
}

function getYears(apiResponse) {
  const lastValidRecord = apiResponse[apiResponse.length - 2];
  const countryWithMostRecords = lastValidRecord["Country"];

  return getCountryRecords(apiResponse, countryWithMostRecords).map(record => (
    record["DateTime"].slice(0, 4)
  ))
}


// new Chart(canvas, {
//   type: 'line',
//   data: {
//     labels: [],
//     datasets: []
//   },
//   options: {
//     elements: {
//       point: {
//         radius: 0
//       }
//     },
//     responsive: false,
//     title: {
//       display: true,
//       fontSize: 32,
//       text: 'Front-Month Futures Contract Price Change [%]'
//     }
//   }
// });
