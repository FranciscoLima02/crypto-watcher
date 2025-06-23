import { useNotifications } from "../hooks/useNotifications.js";

export default function NotificationsList() {
  const { notifications, markAsRead } = useNotifications();
  if (!notifications.length) {
    return <p className="text-gray-400">Nenhuma notificação.</p>;
  }
  return (
    <ul className="space-y-2 max-h-80 overflow-y-auto">
      {notifications.map(n => (
        <li
          key={n.id}
          className={`p-3 rounded-lg flex justify-between items-center ${
            n.read ? "bg-[#1a001f]" : "bg-[#330033]"
          }`}
        >
          <div>
            <p className="text-sm text-[#ff33ff]">
              {n.symbol} {n.direction === "above" ? "▲" : "▼"} alvo {n.priceTarget} →{" "}
              <strong>{n.currentPrice}</strong>
            </p>
            <p className="text-xs text-gray-500">
              {n.createdAt?.toDate().toLocaleString()}
            </p>
          </div>
          {!n.read && (
            <button
              onClick={() => markAsRead(n.id)}
              className="text-xs bg-green-500 px-2 py-1 rounded text-black"
            >
              Marcar lido
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
