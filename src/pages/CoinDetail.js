// src/pages/CoinDetail.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LiveCoinChart from "../components/LiveCoinChart";
import NewsList       from "../components/NewsList";
import {
  fetchCoinDetail,
  fetchCoinTicker,
} from "../utils/coinPaprika";
import { motion } from "framer-motion";

export default function CoinDetail() {
  const { id } = useParams(); // ex: "btc-bitcoin"

  const [coin,    setCoin]    = useState(null);
  const [stats,   setStats]   = useState({
    price:      0,
    market_cap: 0,
    volume_24h: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Trigger both calls in parallel
    Promise.all([
      fetchCoinDetail(id),  // -> /coins/{id}
      fetchCoinTicker(id),  // -> /tickers/{id}
    ])
      .then(([detailRes, tickerRes]) => {
        if (cancelled) return;

        // 1) Coin details
        setCoin(detailRes.data);

        // 2) Market stats
        const q = tickerRes.data.quotes.USD;
        setStats({
          price:      q.price,
          market_cap: q.market_cap,
          volume_24h: q.volume_24h,
        });
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Could not load coin data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const StatCard = ({ label, value, change }) => {
    const isPrice = label === "Price";
    const isChange = typeof change === "number";
    const changeColor = change > 0 ? "text-green-400" : "text-red-400";
    
    return (
      <div className="bg-[#24002c] p-3 md:p-4 rounded-lg shadow-md">
        <div className="text-xs md:text-sm text-gray-400">{label}</div>
        <div className={`text-xl md:text-2xl font-bold ${isPrice ? "text-cyan-400" : "text-white"}`}>
          {value}
          {isChange && (
            <span className={`text-base md:text-lg ml-2 ${changeColor}`}>
              {change > 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center p-10 text-xl text-cyan-400">Loading Details...</div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-xl text-red-500">{error}</div>
    );

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <img
          src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
          alt={coin.name}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#ff33ff]"
        />
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">
            {coin.name}{" "}
            <span className="text-gray-500 lowercase text-lg md:text-2xl">
              {coin.symbol}
            </span>
          </h1>
          <div className="text-base md:text-lg text-gray-400">Rank #{coin.rank}</div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.2}} className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard label="Price" value={stats.price.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })} />
        <StatCard label="Market Cap" value={stats.market_cap.toLocaleString(undefined, { style: 'currency', currency: 'USD', notation: 'compact' })} />
        <StatCard label="Volume (24h)" value={stats.volume_24h.toLocaleString(undefined, { style: 'currency', currency: 'USD', notation: 'compact' })} />
      </motion.div>
      
      {/* Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.4}} className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Price Chart (USD)</h2>
        <div className="bg-[#1b001f] p-2 md:p-4 rounded-xl shadow-lg border border-[#ff33ff50]">
          <LiveCoinChart coinId={id} />
        </div>
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.6}}>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">About {coin.name}</h2>
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">{coin.description || "No description available."}</p>
      </motion.div>

      {/* News */}
      <div className="mt-6 md:mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#ff33ff] mb-3">
          📰 News about {coin.name}
        </h2>
        <NewsList coinName={coin.name} />
      </div>
    </div>
  );
}
