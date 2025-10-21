import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "nohunt.ai - Find Your Dream Job 10x Faster | AI-Powered Job Search",
  description: "Join the nohunt.ai waitlist for early access to AI-powered job hunting. Let your AI agent find jobs for you and get to interviews 10x faster. Revolutionary job search technology.",
  keywords: ["job search", "AI jobs", "career", "job hunting", "recruitment", "AI agent", "employment"],
  authors: [{ name: "nohunt.ai Team" }],
  openGraph: {
    title: "nohunt.ai - AI-Powered Job Search Platform",
    description: "Find your dream job 10x faster with AI-powered job hunting. Join the waitlist for early access.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "nohunt.ai - Find Your Dream Job 10x Faster",
    description: "AI-powered job hunting platform. Join the waitlist for early access.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent flash of unstyled content (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const root = document.documentElement;
                const theme = savedTheme === 'dark' ? 'dark' : 'light';
                root.classList.add(theme);
                root.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
