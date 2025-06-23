// src/components/LogoHeader.js

import React from "react";

export default function LogoHeader() {
  return (
    <div className="text-center mb-4">
      <img
        src="/logo.png"
        alt="CryptoWatcher"
        className="mx-auto my-4 w-48"
        style={{
          filter: "drop-shadow(0 0 24px #ff33ff) drop-shadow(0 0 8px #bb00ff)"
        }}
      />
      {/* Remover o h2! */}
    </div>
  );
}
