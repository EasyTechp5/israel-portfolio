"use client";

import { usePathname } from "next/navigation";

/**
 * Renders its children everywhere except the immersive home scene ("/"),
 * which has its own controls and needs the whole screen.
 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === "/") return null;
  return <>{children}</>;
}
