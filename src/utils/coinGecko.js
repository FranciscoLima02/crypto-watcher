// src/utils/coinGecko.js
import axios from "axios";

/**
 * Busca dados completo de uma moeda (preço, market cap e volume)
 * usando a API do CoinGecko.
 */
export async function fetchCoinGeckoFullData(coinId) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  const params = {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  };
  const res = await axios.get(url, { params });
  return res.data;
}
