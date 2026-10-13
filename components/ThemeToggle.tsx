"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "footer" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const footer = variant === "footer";

  // Reserve the space before mount so the footer does not shift.
  if (!mounted) return <div className={footer ? "h-9 w-[8.5rem]" : "w-9 h-9"} />;

  const dark = resolvedTheme === "dark";
  const next = dark ? "light" : "dark";

  if (footer) {
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors hover:text-white"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: "#c8d3e3",
        }}
        aria-label={`Switch to ${next} mode`}
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {dark ? "Light mode" : "Dark mode"}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(next)}
      className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200"
      style={{
        backgroundColor: "rgba(0,85,218,0.1)",
        borderColor: "rgba(0,85,218,0.3)",
        color: "#0055DA",
      }}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
