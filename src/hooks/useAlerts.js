// src/hooks/useAlerts.js
import { useState, useEffect, useRef } from "react";
import { fetchCurrentPrice } from "../utils/cryptoCompare";

const STORAGE_KEY = "crypto_alerts";

export function useAlerts() {
  const [alerts, setAlerts] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  // Sincroniza com localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  // Polling a cada 30 segundos para verificar preços
  useEffect(() => {
    if (!alerts.length) return;
    let mounted = true;
    const interval = setInterval(async () => {
      for (let a of alertsRef.current) {
        if (a.fired) continue;
        try {
          const res = await fetchCurrentPrice(a.coinSymbol.toUpperCase(), "USD");
          const price = res.data?.USD;
          const condition =
            a.direction === "above" ? price >= a.target : price <= a.target;
          if (condition && mounted) {
            // Dispara notificação
            if (Notification.permission === "granted") {
              new Notification(`Alerta ${a.coinSymbol}`, {
                body: `Preço ${a.direction === "above" ? "acima de" : "abaixo de"} $${a.target} (atual $${price.toLocaleString()})`,
                icon: `https://static.coinpaprika.com/coin/${a.coinId}/logo.png`
              });
            }
            // Marca como disparado
            setAlerts(prev =>
              prev.map(x =>
                x.id === a.id
                  ? {
                      ...x,
                      fired: true
                    }
                  : x
              )
            );
          }
        } catch (err) {
          console.error("Erro ao verificar alerta:", err);
        }
      }
    }, 30_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [alerts]);

  const addAlert = alert => {
    setAlerts(prev => [
      ...prev,
      {
        ...alert,
        id: Date.now(),
        fired: false
      }
    ]);
  };

  const removeAlert = id => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const resetFired = id => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, fired: false } : a))
    );
  };

  return { alerts, addAlert, removeAlert, resetFired };
}
