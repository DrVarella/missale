import type { Metadata } from "next";
import { Crimson_Text, Inter } from "next/font/google";
import { MassViewProvider } from "@/lib/contexts/MassViewContext";
import "./globals.css";

const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Missale Romanum",
  description: "Missal Romano em 6 idiomas - Portuguese, Español, Latina, English, Deutsch, Italiano",
  keywords: ["missal", "catholic", "liturgy", "mass", "roman missal", "liturgia", "missa"],
  authors: [{ name: "Missale Romanum" }],
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${crimsonText.variable} ${inter.variable} font-serif antialiased`}
      >
        <MassViewProvider>
          {children}
        </MassViewProvider>
      </body>
    </html>
  );
}
