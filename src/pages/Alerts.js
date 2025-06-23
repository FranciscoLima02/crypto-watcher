import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertsContext } from "../contexts/AlertsContext";
import PriceAlertForm from "../components/PriceAlertForm";
import { Trash2, Plus } from "react-feather";

export default function Alerts() {
  const { alerts, addAlert, removeAlert } = useContext(AlertsContext);

  function handleAdd(alert) {
    addAlert(alert);
    toast.success("Alert created!");
  }
  function handleRemove(alertId) {
    removeAlert(alertId);
    toast.info("Alert removed!");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl md:text-4xl text-[#ff33ff] font-extrabold flex items-center gap-2">
        <Plus size={28} /> Alerts
      </h1>

      {/* Form */}
      <div className="bg-gradient-to-br from-[#24002c] to-[#1a0022] rounded-xl p-4 md:p-6 border border-[#ff33ff40]">
        <PriceAlertForm onSubmit={handleAdd} />
      </div>

      {/* List */}
      {alerts.length === 0 ? (
        <p className="text-gray-400">No alerts yet.</p>
      ) : (
        <ul className="space-y-3 md:space-y-4">
          {alerts.map((alert) => {
            const logo = alert.coinId
              ? `https://static.coinpaprika.com/coin/${alert.coinId}/logo.png`
              : "/fallback-coin.png";

            return (
              <li
                key={alert.id}
                className="flex items-center justify-between bg-gradient-to-br from-[#24002c] to-[#1a0022] rounded-xl p-3 md:p-4 border border-[#ff33ff40]"
              >
                <Link
                  to={`/coin/${alert.coinId}`}
                  className="flex items-center gap-3 md:gap-4 text-white hover:underline"
                >
                  <img
                    src={logo}
                    alt={alert.symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallback-coin.png";
                    }}
                  />
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <span className="font-bold text-base md:text-lg">{alert.symbol}</span>
                    <span
                      className={
                        alert.condition === "gte" ? "text-green-400" : "text-red-400"
                      }
                    >
                      {alert.condition === "gte" ? "↑" : "↓"} ${alert.targetPrice}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(alert.id)}
                  className="text-red-500 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
