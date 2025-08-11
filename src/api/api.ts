import Papa from "papaparse";

export const getForecastData = async () => {
  const response = await fetch("/combined_forecasts.csv");
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder("utf-8");
  const csv = decoder.decode(result.value);

  return new Promise((resolve) => {
    Papa.parse(csv, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};