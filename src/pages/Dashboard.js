import { useEffect, useState } from "react";
import { fetchTopCoinsDetailed } from "../utils/coinPaprika";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LogoHeader from "../components/LogoHeader";
import { useWatchlist } from "../hooks/useWatchlist";

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("rank");
  const [showFavorites, setShowFavorites] = useState(false);
  const coinsPerPage = 15;
  const maxCoins = 500;
  const navigate = useNavigate();

  // Favorites hook
  const { watchlist, toggleFavorite } = useWatchlist();

  useEffect(() => {
    fetchTopCoinsDetailed(maxCoins)
      .then(res => setCoins(res.data))
      .catch(e => console.error("Error fetching coins:", e))
      .finally(() => setLoading(false));
  }, []);

  // Filter by search
  let filteredCoins = coins.filter(
    coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Filter by favorites if enabled
  if (showFavorites) {
    filteredCoins = filteredCoins.filter(coin => watchlist.includes(coin.id));
  }

  // Advanced sorting
  if (sortBy === "price") {
    filteredCoins.sort((a, b) => (b.quotes.USD.price ?? 0) - (a.quotes.USD.price ?? 0));
  } else if (sortBy === "volume") {
    filteredCoins.sort((a, b) => (b.quotes.USD.volume_24h ?? 0) - (a.quotes.USD.volume_24h ?? 0));
  } else if (sortBy === "marketcap") {
    filteredCoins.sort((a, b) => (b.quotes.USD.market_cap ?? 0) - (a.quotes.USD.market_cap ?? 0));
  } else if (sortBy === "gainers") {
    filteredCoins.sort((a, b) => (b.quotes.USD.percent_change_24h ?? 0) - (a.quotes.USD.percent_change_24h ?? 0));
  } else if (sortBy === "losers") {
    filteredCoins.sort((a, b) => (a.quotes.USD.percent_change_24h ?? 0) - (b.quotes.USD.percent_change_24h ?? 0));
  } else if (sortBy === "name") {
    filteredCoins.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    filteredCoins.sort((a, b) => (a.rank ?? 99999) - (b.rank ?? 99999));
  }

  // Pagination
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);
  const startIndex = (page - 1) * coinsPerPage;
  // Hero cards: always the first 3 of the filtered list
  const heroCoins = filteredCoins.slice(0, 3);
  // Grid coins: next 15 coins after the hero cards, paginated
  const gridCoins = filteredCoins.slice(3 + startIndex, 3 + startIndex + coinsPerPage);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-black via-gray-950 to-[#140022]">
        <LogoHeader />
        <div className="text-cyan-400 text-xl animate-pulse mt-12">Loading coins...</div>
      </div>
    );

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-tr from-black via-gray-950 to-[#140022]">
      <LogoHeader />

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 my-4">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-[#2e003b] text-[#ff33ff] p-2 rounded"
        >
          <option value="rank">Rank</option>
          <option value="price">Price</option>
          <option value="volume">Volume 24h</option>
          <option value="marketcap">Market Cap</option>
          <option value="gainers">Top Gainers (24h)</option>
          <option value="losers">Top Losers (24h)</option>
          <option value="name">Name (A-Z)</option>
        </select>

        {/* Favorites filter */}
        <button
          onClick={() => setShowFavorites(v => !v)}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            showFavorites
              ? "bg-gradient-to-r from-yellow-500 to-pink-500 text-black"
              : "bg-gray-800 text-[#ff33ff]"
          }`}
        >
          {showFavorites ? "Show All" : "Favorites Only"}
        </button>
      </div>

      {/* HERO CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {heroCoins.map((coin, idx) =>
          coin && (
            <motion.div
              key={coin.id}
              whileHover={{ scale: 1.03, boxShadow: "0 0 32px #ff33ff" }}
              className="relative bg-gradient-to-tr from-[#2e003b] via-gray-900 to-gray-950 rounded-2xl p-4 md:p-6 shadow-2xl border-2 border-[#ff33ff30] transition-all group"
              onClick={() => navigate(`/coin/${coin.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="absolute top-4 right-4 text-[#ff33ff] text-base md:text-lg font-black opacity-30 select-none">#{idx + 1}</div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleFavorite(coin);
                }}
                className={`absolute top-4 left-4 text-yellow-400 hover:text-yellow-200 transition ${watchlist.includes(coin.id) ? "scale-110 drop-shadow" : "opacity-50"}`}
                title={watchlist.includes(coin.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <Star fill={watchlist.includes(coin.id) ? "currentColor" : "none"} className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 md:gap-4 mb-3">
                <img
                  src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
                  alt={coin.name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl border-2 border-[#ff33ff]"
                />
                <div>
                  <div className="text-[#ff33ff] text-xl md:text-2xl font-extrabold flex gap-2 neon-glow">
                    {coin.name}
                    <span className="uppercase text-gray-400 text-base md:text-lg">{coin.symbol}</span>
                  </div>
                  <div className="text-green-400 font-bold text-xl md:text-2xl">
                    ${coin.quotes.USD.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) ?? "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-2 items-center mt-4 pt-4 border-t border-white/10 text-xs md:text-sm">
                <div className={`flex items-center gap-1 font-bold ${
                    coin.quotes.USD.percent_change_24h > 0 ? "text-green-400" : "text-red-400"
                  }`}>
                  {coin.quotes.USD.percent_change_24h > 0 ? "▲" : "▼"}
                  {Math.abs(coin.quotes.USD.percent_change_24h ?? 0).toFixed(2)}%
                  <span className="text-gray-400 font-medium ml-1">24h</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <span className="opacity-70 font-semibold">Vol</span>
                  <span>${Number(coin.quotes.USD.volume_24h ?? 0).toLocaleString('en-US', {notation: 'compact', maximumFractionDigits: 1})}</span>
                </div>
                <div className="flex items-center gap-2 text-violet-400">
                  <span className="opacity-70 font-semibold">MCap</span>
                  <span>${Number(coin.quotes.USD.market_cap ?? 0).toLocaleString('en-US', {notation: 'compact', maximumFractionDigits: 1})}</span>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search for a coin..."
        className="mb-6 w-full p-3 rounded-xl bg-gray-800 text-[#ff33ff] placeholder-gray-400 focus:ring-2 focus:ring-[#ff33ff] shadow"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* CARD GRID */}
      <div className="grid grid-cols-5 gap-3 md:gap-4">
        {gridCoins.map((coin) => (
          <motion.div
            key={coin.id}
            whileHover={{ scale: 1.05, boxShadow: "0 0 16px #ff33ff" }}
            className="bg-gradient-to-tr from-gray-900 to-[#2e003b] rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-[#ff33ff50] hover:border-[#ff33ff] transition cursor-pointer group relative"
            onClick={() => navigate(`/coin/${coin.id.toLowerCase()}`)}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <img
                src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
                alt={coin.name}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full"
              />
              <div>
                <h3 className="text-sm md:text-md font-bold text-white truncate w-20 md:w-24">{coin.name}</h3>
                <span className="text-xs text-gray-400">{coin.symbol}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base md:text-lg font-semibold text-green-400">
                ${coin.quotes.USD.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? "N/A"}
              </div>
              <div
                className={`text-xs md:text-sm font-bold ${
                  coin.quotes.USD.percent_change_24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.quotes.USD.percent_change_24h > 0 ? "▲" : "▼"}
                {Math.abs(coin.quotes.USD.percent_change_24h ?? 0).toFixed(2)}%
                <span className="hidden sm:inline text-gray-400 text-xs ml-1">(24h)</span>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(coin);
              }}
              className={`absolute top-2 right-2 md:top-3 md:right-3 text-yellow-400 hover:text-yellow-200 transition ${
                watchlist.includes(coin.id) ? "opacity-100 scale-110" : "opacity-40"
              } group-hover:opacity-100`}
              title={watchlist.includes(coin.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Star fill={watchlist.includes(coin.id) ? "currentColor" : "none"} className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center mt-8 space-x-3">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 text-[#ff33ff] rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-800 text-[#ff33ff] rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
