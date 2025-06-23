import { useState, useEffect } from "react";
import { useCoins } from "../contexts/CoinsContext";
import { ArrowDownUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Converter() {
  const { coins } = useCoins();
  const [amountFrom, setAmountFrom] = useState(1);
  const [amountTo, setAmountTo] = useState("");
  const [coinFrom, setCoinFrom] = useState(null);
  const [coinTo, setCoinTo] = useState(null);

  // Initialize with the first two coins (e.g., BTC and ETH)
  useEffect(() => {
    if (coins.length > 1) {
      setCoinFrom(coins.find(c => c.symbol === "BTC") || coins[0]);
      setCoinTo(coins.find(c => c.symbol === "ETH") || coins[1]);
    }
  }, [coins]);

  // Effect to calculate the conversion when any value changes
  useEffect(() => {
    if (coinFrom && coinTo && amountFrom) {
      const priceFrom = coinFrom.quotes.USD.price;
      const priceTo = coinTo.quotes.USD.price;
      const result = (amountFrom * priceFrom) / priceTo;
      setAmountTo(result.toFixed(8));
    } else {
      setAmountTo("");
    }
  }, [amountFrom, coinFrom, coinTo]);


  const handleAmountFromChange = (e) => {
    setAmountFrom(e.target.value);
  };

  const handleSwap = () => {
    setCoinFrom(coinTo);
    setCoinTo(coinFrom);
  };

  if (coins.length === 0) {
    return <div className="text-center text-xl text-gray-400">Loading coins...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl text-center text-[#ff33ff] font-extrabold mb-6 md:mb-8">
        Currency Converter
      </h1>

      <motion.div 
        className="bg-gradient-to-br from-[#24002c] to-[#1a0022] rounded-2xl shadow-2xl p-4 md:p-6 border border-[#ff33ff40]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* "From" Input */}
          <div className="w-full">
            <label className="text-gray-400 mb-2 block text-sm">From</label>
            <div className="flex">
              <input
                type="number"
                value={amountFrom}
                onChange={handleAmountFromChange}
                className="w-full p-3 rounded-l-lg bg-[#2e003b] text-white border-y border-l border-[#555] focus:ring-2 focus:ring-[#ff33ff] focus:outline-none"
              />
              <select
                value={coinFrom?.id}
                onChange={(e) => setCoinFrom(coins.find(c => c.id === e.target.value))}
                className="p-3 rounded-r-lg bg-[#2e003b] text-white border-y border-r border-[#555] focus:ring-2 focus:ring-[#ff33ff] focus:outline-none appearance-none"
              >
                {coins.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="my-2">
            <button
              onClick={handleSwap}
              className="p-3 bg-[#ff33ff] text-black rounded-full hover:bg-opacity-80 transition-transform hover:rotate-180"
            >
              <ArrowDownUp size={24} />
            </button>
          </div>

          {/* "To" Input */}
          <div className="w-full">
            <label className="text-gray-400 mb-2 block text-sm">To</label>
            <div className="flex">
              <input
                type="number"
                value={amountTo}
                readOnly
                className="w-full p-3 rounded-l-lg bg-[#1b001f] text-gray-300 border-y border-l border-[#555]"
              />
              <select
                value={coinTo?.id}
                onChange={(e) => setCoinTo(coins.find(c => c.id === e.target.value))}
                className="p-3 rounded-r-lg bg-[#2e003b] text-white border-y border-r border-[#555] focus:ring-2 focus:ring-[#ff33ff] focus:outline-none appearance-none"
              >
                {coins.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {coinFrom && coinTo && (
            <div className="text-center mt-6 text-gray-300 text-base md:text-lg">
                1 {coinFrom.symbol} = {(coinFrom.quotes.USD.price / coinTo.quotes.USD.price).toFixed(6)} {coinTo.symbol}
            </div>
        )}
      </motion.div>
    </div>
  );
} 