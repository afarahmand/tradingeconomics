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
    countryDatasets.push( getCountryDataset(apiResponse, countries[i]) );
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

module.exports = {
  fetchPopulationData,
  filterCountryRecords,
  getCountryDataset,
  getCountryDatasets,
  getYearsArray
}
