// src/components/PriceAlertForm.js
import React, { useState } from "react";
import { useCoins } from "../contexts/CoinsContext";

export default function PriceAlertForm({ onSubmit }) {
  const { coins } = useCoins();
  const [coinId, setCoinId] = useState("");
  const [condition, setCondition] = useState("gte");
  const [targetPrice, setTargetPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!coinId || !targetPrice) return;
    const selectedCoin = coins.find(c => c.id === coinId);
    onSubmit({
      coinId: coinId,
      symbol: selectedCoin.symbol, // Also save the symbol for display purposes
      condition: condition,
      targetPrice: parseFloat(targetPrice),
    });
    setCoinId("");
    setCondition("gte");
    setTargetPrice("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      {/* Coin */}
      <select
        className="flex-1 px-3 py-2 bg-[#2e003b] rounded text-white border border-[#555]"
        value={coinId}
        onChange={(e) => setCoinId(e.target.value)}
      >
        <option value="">Choose a coin</option>
        {coins.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.symbol}) — ${c.quotes?.USD?.price?.toFixed(2) || "N/A"}
          </option>
        ))}
      </select>

      {/* Condition */}
      <select
        className="px-3 py-2 bg-[#2e003b] rounded text-white border border-[#555]"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="gte">↑ Above</option>
        <option value="lte">↓ Below</option>
      </select>

      {/* Target Value */}
      <input
        type="number"
        step="any"
        className="w-24 px-3 py-2 bg-[#2e003b] rounded text-white border border-[#555]"
        placeholder="Target"
        value={targetPrice}
        onChange={(e) => setTargetPrice(e.target.value)}
      />

      {/* Button */}
      <button
        type="submit"
        className="px-4 py-2 bg-[#ff33ff] rounded text-black font-bold hover:bg-[#e600e6]"
      >
        +
      </button>
    </form>
  );
}
