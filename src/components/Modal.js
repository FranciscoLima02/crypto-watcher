// src/components/Modal.js
import React from "react";

export default function Modal({ children, onClose, isOpen }) {
  if (!isOpen) return null;
  const handleClose = () => {
    console.log("DEBUG: handleClose foi chamada");
    onClose();
  };
  
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-[#1c0135] rounded-2xl p-6 w-full max-w-md relative"
        onClick={e => {
          console.log("DEBUG: Clique dentro do conteúdo do Modal. A propagação foi parada.");
          e.stopPropagation();
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          title="Fechar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
