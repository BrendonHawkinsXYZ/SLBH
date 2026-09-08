import type { Metadata } from "next";
import { Orbitron, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AmbientShape } from "@/components/AmbientShape";
import { CircleCursor } from "@/components/CircleCursor";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Lab BH",
  description:
    "Studio Lab BH is a systems research lab working across affect, systems, data, and time.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${inter.variable} ${plexMono.variable}`}
      >
        <a className="skip-link" href="#main">Skip to content</a>
        <AmbientShape />
        <CircleCursor />
        <Nav />
        <div className="site-scroll-plane" data-site-scroll>
          <main id="main" style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
