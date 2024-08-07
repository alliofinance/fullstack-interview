// components/LineChart.js
import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(...registerables);

export type BarChartProps = {
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
  symbol: string;
};

function BarChart(props: BarChartProps) {
  const { chartData, symbol } = props;
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Volume</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: symbol,
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
export default BarChart;
