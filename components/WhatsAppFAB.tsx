"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0 hover:gap-2.5 rounded-full pl-3.5 pr-3.5 hover:pr-5 py-3.5 transition-all duration-300"
      style={{ backgroundColor: "#0b7a3e", boxShadow: "0 8px 28px rgba(11,122,62,0.42)" }}
      aria-label="Chat with Israel on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 flex-shrink-0" style={{ color: "#fff" }} />
      <span
        className="overflow-hidden whitespace-nowrap font-semibold text-sm max-w-0 group-hover:max-w-[9rem] transition-all duration-300"
        style={{ color: "#fff" }}
      >
        Chat with me
      </span>
    </a>
  );
}
