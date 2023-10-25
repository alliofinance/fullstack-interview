"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import LineChart, { LineChartProps } from "./LineChart";
import { ChartDatum, Lookbacks } from "./api/route";
import BarChart from "./BarChart";

type ChartDataPoints = {
  labels: string[];
  data: number[];
};

const convertToChartPoints = (data: ChartDatum[]): ChartDataPoints => {
  const labels: string[] = [];
  const values: number[] = [];

  data.forEach((datum) => {
    labels.push(datum.date);
    values.push(Number(datum.value));
  });
  return { labels, data: values };
};

type ChartSelectionType = "price" | "volume";

export default function Home() {
  const [data, setData] = useState<LineChartProps | null>(null);
  const [tickerSelection, setTickerSelection] = useState<string>("IBM");
  const [chartSelectionType, setChartSelectionType] =
    useState<ChartSelectionType>("price");
  const [lookback, setLookback] = useState<Lookbacks>("1y");
  const lookbackChoices: Lookbacks[] = ["1m", "3m", "6m", "1y", "5y", "All"];

  useEffect(() => {
    fetch(
      `/api?ticker=${tickerSelection}&chartType=${chartSelectionType}&lookback=${lookback}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const chartPoints = convertToChartPoints(data.chartData);
        setData({
          chartData: {
            labels: chartPoints.labels,
            datasets: [{ label: tickerSelection, data: chartPoints.data }],
          },
          ticker: tickerSelection,
        });
      });
  }, [tickerSelection, chartSelectionType, lookback]);

  return (
    <main className={styles.main} style={{ marginTop: "100px" }}>
      {data &&
        (chartSelectionType == "price" ? (
          <LineChart chartData={data.chartData} ticker={data.ticker} />
        ) : (
          <BarChart chartData={data.chartData} ticker={data.ticker} />
        ))}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ width: "50px", margin: "10px 10px" }}
          onClick={() => setChartSelectionType("price")}
        >
          Prices
        </button>
        <button
          style={{ width: "50px", margin: "10px 10px" }}
          onClick={() => setChartSelectionType("volume")}
        >
          Volume
        </button>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        {lookbackChoices.map((lookbackChoice, idx) => (
          <button
            key={idx}
            style={{ width: "50px", margin: "10px 10px" }}
            onClick={() => setLookback(lookbackChoice)}
          >
            {lookbackChoice}
          </button>
        ))}
      </div>
    </main>
  );
}
