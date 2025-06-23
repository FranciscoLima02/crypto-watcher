import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Home, Bell, User, LogOut, RefreshCw } from "react-feather";
import { AlertsContext } from "../contexts/AlertsContext";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";

export default function Sidebar() {
  const { alerts } = useContext(AlertsContext);
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const mainLinks = [
    { to: "/",          icon: <Home size={24} />,       title: "Dashboard" },
    { to: "/converter", icon: <RefreshCw size={24} />,  title: "Converter" },
    { to: "/profile",   icon: <User size={24} />,       title: "Profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 flex flex-col bg-[#1b001f] text-[#ff33ff]">
      {/* Bell at the top */}
      <NavLink
        to="/alerts"
        className="relative mt-6 mx-auto p-2 hover:bg-[#330033] rounded-lg"
        title="Alerts"
      >
        <Bell size={24} />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </NavLink>

      {/* Center icons */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {mainLinks.map(({ to, icon, title }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `p-2 hover:bg-[#330033] rounded-lg ${isActive ? "bg-[#330033]" : ""}`
            }
            title={title}
          >
            {icon}
          </NavLink>
        ))}
      </div>

      {/* Logout at the bottom */}
      <button
        onClick={() => auth.signOut()}
        className="mb-6 mx-auto p-2 hover:bg-[#330033] rounded-lg"
        title="Logout"
      >
        <LogOut size={24} />
      </button>
    </aside>
  );
}
