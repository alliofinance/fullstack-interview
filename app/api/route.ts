import { getFakeData } from "./do-not-look-at-this";

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
  const queryParams = getParams(request);
  const lookback = queryParams["lookback"] as Lookbacks;
  const startDate = getStartDateFromLookback(lookback);

  // please do not look into getFakeData -- pretend it's a real API w/ data
  const res: Record<string, any> = getFakeData();

  const chartData: ChartDatum[] = [];

  Object.entries(res["Time Series (Daily)"]).forEach(([date, data]) => {
    const dataObj = data as Record<string, string>;
    if (startDate && new Date(date) < startDate) return;
    const dataType = "4. close"; // TODO: grab other data

    chartData.push({ date, value: dataObj[dataType] });
  });

  const toReturn: ChartResponse = { chartData };

  return Response.json(toReturn);
}
