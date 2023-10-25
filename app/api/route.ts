import { getFakeData } from "./do-not-look-at-this";

const ALPHA_API_KEY = "5XZU2IUHUFZ2ZBTV";

// idea: remove this and make them look up the result to find more
const RESULT_MAP = {
  open: "1. open",
  high: "2. high",
  low: "3. low",
  close: "4. close",
  volume: "5. volume",
};

export type ChartDatum = {
  date: string;
  value: string;
};

export type ChartResponse = {
  chartData: ChartDatum[];
};

export type Lookbacks = "1m" | "3m" | "6m" | "1y" | "5y" | "All";

const getParams = (request: Request): Record<string, string> => {
  const queryParamSection = request.url.split("?")[1];
  const queryParamPairs = queryParamSection.split("&");
  const queryParamMap = queryParamPairs.reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    return { ...acc, [key]: value };
  }, {});

  return queryParamMap;
};

function getStartDateFromLookback(lookback: Lookbacks): null | Date {
  if (lookback === "All") return null;

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  switch (lookback) {
    case "1m":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "3m":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "6m":
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case "1y":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case "5y":
      startDate.setFullYear(startDate.getFullYear() - 5);
      break;
  }

  return startDate;
}

export async function GET(request: Request) {
  // get param ticker off of request query param
  const queryParams = getParams(request);
  const chartType = queryParams["chartType"];
  const lookback = queryParams["lookback"] as Lookbacks;
  const startDate = getStartDateFromLookback(lookback);

  // please do not look into getFakeData -- pretend it's a real API w/ data
  const res: Record<string, any> = getFakeData();

  const chartData: ChartDatum[] = [];

  Object.entries(res["Time Series (Daily)"]).forEach(([date, data]) => {
    const dataObj = data as Record<string, string>;
    if (startDate && new Date(date) < startDate) return;
    const dataType =
      chartType === "price" ? RESULT_MAP.close : RESULT_MAP.volume;

    chartData.push({ date, value: dataObj[dataType] });
  });

  const toReturn: ChartResponse = { chartData };

  return Response.json(toReturn);
}
