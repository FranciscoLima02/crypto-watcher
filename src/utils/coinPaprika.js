// src/utils/coinPaprika.js
import axios from "axios";

const API_BASE = "https://api.coinpaprika.com/v1";

export async function fetchTopCoins() {
  return axios.get(`${API_BASE}/coins`);
}

export async function fetchTopCoinsDetailed(limit = 500) {
    return axios.get(`${API_BASE}/tickers?limit=${limit}`);
}

export async function fetchCoinsList(limit = 15) {
  return axios.get(`${API_BASE}/coins`).then(response => {
    return response.data.slice(0, limit);
  });
}

export async function fetchCoinTicker(coinId) {
  return axios.get(`${API_BASE}/tickers/${coinId}`);
}

export async function fetchCoinDetail(coinId) {
  return axios.get(`${API_BASE}/coins/${coinId}`);
}

// Nova função para histórico, adaptada à API CoinPaprika
export async function fetchCoinHistorical(coinId) {
  // Pega dados de mercado históricos últimos 1 dia (por hora)
  // Exemplo endpoint: /coins/{coinId}/ohlcv/historical?start=YYYY-MM-DD&end=YYYY-MM-DD
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDate = d => d.toISOString().split("T")[0];

  const start = formatDate(yesterday);
  const end = formatDate(today);

  return axios.get(`${API_BASE}/coins/${coinId}/ohlcv/historical`, {
    params: { start, end }
  });
}
