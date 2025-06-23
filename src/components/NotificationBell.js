import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications.js";

export default function NotificationBell({ onClick }) {
  const { unreadCount } = useNotifications();
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#181626]/70 border-2 border-[#ff33ff]"
    >
      <Bell className="w-6 h-6 text-[#ff33ff]" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff33ff] text-white rounded-full text-xs font-bold flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
