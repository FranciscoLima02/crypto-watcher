import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'crypto-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading watchlist from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error("Error writing watchlist to localStorage", error);
    }
  }, [watchlist]);

  const toggleFavorite = useCallback((coin) => {
    setWatchlist(prev => {
      const coinId = coin.id;
      if (prev.includes(coinId)) {
        return prev.filter(id => id !== coinId);
      } else {
        return [...prev, coinId];
      }
    });
  }, []);

  return { watchlist, toggleFavorite };
} 