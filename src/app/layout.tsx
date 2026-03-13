import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const orbitron = localFont({
  src: "../fonts/orbitron-latin-900-normal.woff2",
  variable: "--font-orbitron",
  weight: "900",
});

const orbitronRegular = localFont({
  src: "../fonts/orbitron-latin-400-normal.woff2",
  variable: "--font-orbitron-regular",
  weight: "400",
});

const orbitronExtrabold = localFont({
  src: "../fonts/orbitron-latin-800-normal.woff2",
  variable: "--font-orbitron-extrabold",
  weight: "800",
});

const inter = localFont({
  src: "../fonts/inter-latin-400-normal.woff2",
  variable: "--font-inter",
  weight: "400",
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
        className={`${orbitron.variable} ${orbitronRegular.variable} ${orbitronExtrabold.variable} ${inter.variable} ${figtree.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
