import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const orbitron = localFont({
  src: "../fonts/orbitron-latin-900-normal.woff2",
  variable: "--font-orbitron",
  weight: "900",
});

const figtree = localFont({
  src: "../fonts/figtree-latin-400-normal.woff2",
  variable: "--font-figtree",
  weight: "400",
});

export const metadata: Metadata = {
  title: "SLBH — Studio Lab BH",
  description:
    "Studio Lab BH is an applied research and product studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${figtree.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
