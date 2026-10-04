import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import NewsletterPopup from "@/components/NewsletterPopup";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://israel.easytech365.com"),
  // "./" resolves to each page's own URL, so every page declares itself canonical
  alternates: { canonical: "./" },
  title: "Israel Afolabi | AI Engineer | AI Automation Specialist | Agentic AI Builder",
  description:
    "I design intelligent systems that replace manual work with automation, helping businesses scale faster, reduce costs, and operate efficiently.",
  authors: [{ name: "Israel Afolabi" }],
  keywords: ["AI Automation", "AI Engineer", "Agentic AI", "n8n", "Make.com", "AI Consultant", "AI Training", "Workflow Automation", "Israel Afolabi", "EasyTech", "Business Automation"],
  // Google Search Console verification.
  // Paste the content value from the "HTML tag" method here, then push.
  // Example tag: <meta name="google-site-verification" content="AbC123..." />
  // verification: { google: "PASTE_YOUR_CODE_HERE" },

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Israel Afolabi | AI Engineer | AI Automation Specialist | Agentic AI Builder",
    description: "I design intelligent systems that replace manual work with automation.",
  },
};

// Tells search engines who this site is about. Only facts that appear on the site.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://israel.easytech365.com/#person",
      name: "Israel Afolabi",
      url: "https://israel.easytech365.com",
      image: "https://israel.easytech365.com/images/israel-hero.jpg",
      jobTitle: "AI Engineer and AI Automation Specialist",
      description:
        "AI automation engineer and consultant who designs automation systems and AI agents for businesses, and trains professionals in AI.",
      address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
      worksFor: { "@type": "Organization", name: "EasyTech Academy", url: "https://easytech365.com" },
      sameAs: [
        "https://www.linkedin.com/in/helloisrael/",
        "https://github.com/EasyTechp5",
        "https://www.youtube.com/@afolabiisraelolajide949",
      ],
      knowsAbout: [
        "AI automation",
        "Agentic AI",
        "Workflow automation",
        "n8n",
        "Make.com",
        "AI agents",
        "Business intelligence",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://israel.easytech365.com/#service",
      name: "Israel Afolabi — AI Automation",
      url: "https://israel.easytech365.com",
      image: "https://israel.easytech365.com/images/israel-hero.jpg",
      description:
        "AI automation, AI agents and AI training for businesses. Remote, working with clients worldwide from Lagos, Nigeria.",
      provider: { "@id": "https://israel.easytech365.com/#person" },
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
    },
    {
      "@type": "WebSite",
      "@id": "https://israel.easytech365.com/#website",
      url: "https://israel.easytech365.com",
      name: "Israel Afolabi",
      publisher: { "@id": "https://israel.easytech365.com/#person" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {/* Scroll-reveal starts hidden only when scripting is available, so the
            page still renders fully if JS is disabled or fails to load. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFAB />
          <NewsletterPopup />
        </ThemeProvider>
        {/* Privacy-friendly visitor analytics (page views, referrers, top pages).
            Requires Web Analytics to be enabled in the Vercel project settings. */}
        <Analytics />
      </body>
    </html>
  );
}
