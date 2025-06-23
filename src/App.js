import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard  from "./pages/Dashboard";
import Converter from "./pages/Converter";
import Alerts     from "./pages/Alerts";
import Profile    from "./pages/Profile";
import CoinDetail from "./pages/CoinDetail";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import SalesforceChat from "./components/SalesforceChat";
import { useAuth } from "./contexts/AuthContext";
import useAlertChecker from "./hooks/useAlertChecker";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();
  
  // Ativa o verificador de alertas
  useAlertChecker();

  return (
    <BrowserRouter>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-[#1a0022]" />
      <div className="flex">
        {user && <Sidebar />}
        <main className="w-full min-h-screen">
          <div className={`${user ? "ml-20" : ""} w-full`}>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
              <Route path="/converter" element={<PrivateRoute><Converter/></PrivateRoute>} />
              <Route path="/alerts" element={<PrivateRoute><Alerts/></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
              <Route path="/coin/:id" element={<PrivateRoute><CoinDetail/></PrivateRoute>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
            </Routes>
          </div>
        </main>
      </div>
      <SalesforceChat />
    </BrowserRouter>
  );
}
