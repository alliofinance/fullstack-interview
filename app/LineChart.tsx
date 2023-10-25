// components/LineChart.js
import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(...registerables);

export type LineChartProps = {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  ticker: string;
};

function LineChart(props: LineChartProps) {
  const { chartData, ticker } = props;
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Prices</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: ticker,
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
export default LineChart;
