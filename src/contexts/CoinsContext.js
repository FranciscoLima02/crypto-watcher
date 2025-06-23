// src/contexts/CoinsContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchTopCoinsDetailed } from "../utils/coinPaprika";

export const CoinsContext = createContext({
  coins: []
});

export const useCoins = () => useContext(CoinsContext);

export function CoinsProvider({ children }) {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    // loads 15 coins with prices
    fetchTopCoinsDetailed(15)
      .then(response => {
        setCoins(response.data);
      })
      .catch(err => {
        console.error("Error loading coin list:", err);
      });
  }, []);

  return (
    <CoinsContext.Provider value={{ coins }}>
      {children}
    </CoinsContext.Provider>
  );
}
