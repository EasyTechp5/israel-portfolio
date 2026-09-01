"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    // Light is the default first impression. enableSystem stays off so a
    // visitor on a dark-mode device still lands on light; the toggle then
    // stores their choice and it persists on return visits.
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
