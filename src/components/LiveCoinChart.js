import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
);
// Mapeamento do timeframe → config da API
const TIMEFRAME_OPTIONS = [
  { label: "1m", value: "minute", limit: 60, aggregate: 1 },
  { label: "5m", value: "minute", limit: 60, aggregate: 5 },
  { label: "1h", value: "hour", limit: 24, aggregate: 1 },
  { label: "1d", value: "day", limit: 30, aggregate: 1 },
  { label: "1w", value: "day", limit: 56, aggregate: 7 },
  { label: "1y", value: "day", limit: 365, aggregate: 1 },
];

export default function LiveCoinChart({ coinSymbol = "BTC", currency = "USD" }) {
  const [timeframe, setTimeframe] = useState(TIMEFRAME_OPTIONS[2]); // default 1h
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch histórico sempre que timeframe ou moeda mudam
  useEffect(() => {
    async function fetchChart() {
      setLoading(true);
      let endpoint = "";
      if (timeframe.value === "minute") {
        endpoint = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${coinSymbol}&tsym=${currency}&limit=${timeframe.limit}&aggregate=${timeframe.aggregate}`;
      } else if (timeframe.value === "hour") {
        endpoint = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${coinSymbol}&tsym=${currency}&limit=${timeframe.limit}&aggregate=${timeframe.aggregate}`;
      } else if (timeframe.value === "day") {
        endpoint = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coinSymbol}&tsym=${currency}&limit=${timeframe.limit}&aggregate=${timeframe.aggregate}`;
      }
      try {
        const res = await fetch(endpoint);
        const json = await res.json();
        const data = json.Data.Data;

        setChartData({
          labels: data.map(d =>
            timeframe.value === "minute" || timeframe.value === "hour"
              ? new Date(d.time * 1000).toLocaleTimeString()
              : new Date(d.time * 1000).toLocaleDateString()
          ),
          datasets: [
            {
              label: `${coinSymbol}/${currency}`,
              data: data.map(d => d.close),
              fill: true,
              tension: 0.4,
              borderColor: "#ff33ff",
              backgroundColor: "rgba(255,51,255,0.08)",
              pointRadius: 0,
            },
          ],
        });
      } catch {
        setChartData(null);
      }
      setLoading(false);
    }
    fetchChart();
  }, [coinSymbol, currency, timeframe]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#19002299] rounded-2xl p-6 shadow-xl border-2 border-[#ff33ff30] mt-8">
      <div className="flex gap-2 mb-5 justify-end">
        {TIMEFRAME_OPTIONS.map(opt => (
          <button
            key={opt.label}
            onClick={() => setTimeframe(opt)}
            className={`px-3 py-1 rounded-lg font-bold text-sm transition border-2 ${
              timeframe.label === opt.label
                ? "bg-[#ff33ff] text-black border-[#ff33ff]"
                : "bg-[#2e003b] text-[#ff33ff] border-[#ff33ff44] hover:bg-[#ff33ff22]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {loading && (
        <div className="text-[#ff33ff] text-center py-10 font-bold animate-pulse">
          A carregar gráfico...
        </div>
      )}
      {!loading && chartData && (
        <div className="relative w-full" style={{ height: "260px" }}>
          <Line
            data={chartData}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: { mode: "index", intersect: false },
              },
              scales: {
                x: { display: true, grid: { display: false } },
                y: { display: true, grid: { color: "#31224b" } },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      )}
    </div>
  );
}