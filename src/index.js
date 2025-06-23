import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider }   from "./contexts/AuthContext";
import { CoinsProvider }  from "./contexts/CoinsContext";
import { AlertsProvider } from "./contexts/AlertsContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CoinsProvider>
        <AlertsProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </AlertsProvider>
      </CoinsProvider>
    </AuthProvider>
  </React.StrictMode>
);
