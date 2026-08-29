import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Israel Afolabi | AI Engineer | AI Automation Specialist | Agentic AI Builder",
  description:
    "I design intelligent systems that replace manual work with automation, helping businesses scale faster, reduce costs, and operate efficiently.",
  authors: [{ name: "Israel Afolabi" }],
  keywords: ["AI Automation", "AI Engineer", "Agentic AI", "n8n", "Make.com", "AI Consultant", "AI Training", "Workflow Automation", "Israel Afolabi", "EasyTech", "Business Automation"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Israel Afolabi | AI Engineer | AI Automation Specialist | Agentic AI Builder",
    description: "I design intelligent systems that replace manual work with automation.",
    url: "https://israel.easytech365.com",
    siteName: "Israel Afolabi",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://israel.easytech365.com/og-israel.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Israel Afolabi | AI Engineer | AI Automation Specialist | Agentic AI Builder",
    description: "I design intelligent systems that replace manual work with automation.",
    images: ["https://israel.easytech365.com/og-israel.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFAB />
        </ThemeProvider>
      </body>
    </html>
  );
}
