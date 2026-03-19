import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from './components/Header/page.js'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AssetSight AI Training",
  description: "An AI-powered web platform exploring interactive 3D visualization and training avatars. Users can control a humanoid avatar using natural language, combining real-time 3D rendering with AI-driven command interpretation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
