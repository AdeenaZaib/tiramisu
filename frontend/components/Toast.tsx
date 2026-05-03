"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  // Automatically hide the toast after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  // Don't render anything if there is no message
  if (!message) return null;

  // Uses your brand's dark brown for success, and a dark red for errors
  const bgColor = type === "error" ? "#8B2415" : "#2C2416";

  return (
    <>
      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      <div style={{
        position: "fixed",
        bottom: 40, // Distance from the bottom of the screen
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: bgColor,
        color: "#FDFAF5",
        padding: "16px 36px",
        borderRadius: 100,
        fontFamily: "'Jost', sans-serif",
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontWeight: 600,
        boxShadow: "0 12px 40px rgba(44, 36, 22, 0.25)",
        zIndex: 9999, // Ensures it sits on top of absolutely everything
        animation: "toastSlideUp 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        textAlign: "center",
        whiteSpace: "nowrap"
      }}>
        {message}
      </div>
    </>
  );
}