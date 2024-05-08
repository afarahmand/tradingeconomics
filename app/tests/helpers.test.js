const {
  filterCountryRecords,
  getCountryDataset,
  getCountryDatasets,
  getYearsArray
} = require('../src/helpers');

// Test suite for filterCountryRecords
describe('function filterCountryRecords', () => {
  const apiResponse = [
    { Country: 'Thailand', Value: 100, DateTime: '2021-01-01', Frequency: 'Yearly' },
    { Country: 'Mexico', Value: 200, DateTime: '2020-01-01', Frequency: 'Yearly' },
    { Country: 'Thailand', Value: 300, DateTime: '2022-01-01', Frequency: 'Yearly' },
    { Country: "Free accounts have access to the following countries: Mexico, New Zealand, Sweden, Thailand. For more, contact us at support@tradingeconomics.com.", Category: "", DateTime: "2024-05-08T04:07:46.4600418+00:00", Value: 0, Frequency: null, HistoricalDataSymbol: null, LastUpdate: null }
  ];

  test('filters subset of records associated with a single country from the API response', () => {
    const country = 'Thailand';
    const filteredRecords = filterCountryRecords(apiResponse, country);
    expect(filteredRecords).toEqual([
      { Country: 'Thailand', Value: 100, DateTime: '2021-01-01', Frequency: 'Yearly' },
      { Country: 'Thailand', Value: 300, DateTime: '2022-01-01', Frequency: 'Yearly' },
    ]);
  });

  test('returns an empty array if no records match the country', () => {
    const country = 'France';
    const filteredRecords = filterCountryRecords(apiResponse, country);
    expect(filteredRecords).toEqual([]);
  });
});

// Test suite for getCountryDataset
describe('function getCountryDataset', () => {
  const apiResponse = [
    { Country: 'USA', Value: 100, DateTime: '2020-01-01', Frequency: 'Yearly' },
    { Country: 'UK', Value: 200, DateTime: '2021-01-01', Frequency: 'Yearly' },
    { Country: 'USA', Value: 300, DateTime: '2021-01-01', Frequency: 'Yearly' },
    { Country: "Free accounts have access to the following countries: Mexico, New Zealand, Sweden, Thailand. For more, contact us at support@tradingeconomics.com.", Category: "", DateTime: "2024-05-08T04:07:46.4600418+00:00", Value: 0, Frequency: null, HistoricalDataSymbol: null, LastUpdate: null }
  ];

  test('returns an object with a label identifying a single country and an array of population values', () => {
    const country = 'USA';
    const countryDataset = getCountryDataset(apiResponse, country);
    expect(countryDataset).toEqual({ label: 'USA', data: [100, 300] });
  });

  test('returns empty dataset if no records match the country', () => {
    const country = 'France';
    const countryDataset = getCountryDataset(apiResponse, country);
    expect(countryDataset).toEqual({ label: 'France', data: [] });
  });
});

// Test suite for getCountryDatasets
describe('function getCountryDatasets', () => {
  const apiResponse = [
    { Country: 'Thailand', Value: 100, DateTime: '2021-01-01', Frequency: 'Yearly' },
    { Country: 'Mexico', Value: 200, DateTime: '2020-01-01', Frequency: 'Yearly' },
    { Country: 'Thailand', Value: 300, DateTime: '2022-01-01', Frequency: 'Yearly' },
    { Country: 'USA', Value: 100, DateTime: '2021-01-01', Frequency: 'Yearly' },
    { Country: 'UK', Value: 200, DateTime: '2020-01-01', Frequency: 'Yearly' },
    { Country: 'USA', Value: 300, DateTime: '2022-01-01', Frequency: 'Yearly' },
    { Country: "Free accounts have access to the following countries: Mexico, New Zealand, Sweden, Thailand. For more, contact us at support@tradingeconomics.com.", Category: "", DateTime: "2024-05-08T04:07:46.4600418+00:00", Value: 0, Frequency: null, HistoricalDataSymbol: null, LastUpdate: null }
  ];
  const countries = ['Mexico', 'Thailand'];

  test('returns an array of dataset objects, each of which include a country label and array of population values', () => {
    const countryDatasets = getCountryDatasets(apiResponse, countries);
    expect(countryDatasets).toEqual([
      { label: 'Mexico', data: [200] },
      { label: 'Thailand', data: [100, 300] },
    ]);
  });
});

// Test suite for getYearsArray
describe('function getYearsArray', () => {
  const apiResponse = [
    { Country: 'USA', Value: 100, DateTime: '2021-01-01' },
    { Country: 'UK', Value: 200, DateTime: '2021-01-01' },
    { Country: 'USA', Value: 300, DateTime: '2022-01-01' },
    { Country: "Free accounts have access to the following countries: Mexico, New Zealand, Sweden, Thailand. For more, contact us at support@tradingeconomics.com.", Category: "", DateTime: "2024-05-08T04:07:46.4600418+00:00", Value: 0, Frequency: null, HistoricalDataSymbol: null, LastUpdate: null }
  ];

  test('returns an array of years based on the last valid record', () => {
    const yearsArray = getYearsArray(apiResponse);
    expect(yearsArray).toEqual(['2021', '2022']);
  });
});
