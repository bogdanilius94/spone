import type { Metadata } from "next";
import {
  Anton,
  Bebas_Neue,
  Black_Ops_One,
  Orbitron,
  Russo_One,
  Space_Grotesk,
  Teko,
} from "next/font/google";

import "./globals.css";

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const blackOpsOne = Black_Ops_One({
  variable: "--font-black-ops",
  weight: "400",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-russo",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rap Artist SPA",
  description: "Interactive artist portfolio with secure admin management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${bebas.variable} ${teko.variable} ${orbitron.variable} ${anton.variable} ${blackOpsOne.variable} ${russoOne.variable}`}
    >
      <body className="min-h-screen bg-[--color-bg] text-[--color-text] antialiased">
        {children}
      </body>
    </html>
  );
}

