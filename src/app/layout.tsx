import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ContactProvider } from "@/components/ui/contact-dialog";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://codexa-products-page.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Codexa — Produtos digitais que transformam negócios",
    template: "%s · Codexa",
  },
  description:
    "Produtos, software e soluções digitais da Codexa para simplificar operações, conectar pessoas e impulsionar resultados reais.",
  keywords: [
    "Codexa",
    "software",
    "Brainlink",
    "Vitrinefolio",
    "Gestão Paroquial",
    "MinutaAI",
    "B2B",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Codexa",
    title: "Codexa — Produtos que geram resultado real",
    description:
      "Uma constelação de produtos de software da Codexa: memória para IA, portfólios, gestão e automação jurídica.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08101d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <ContactProvider>{children}</ContactProvider>
      </body>
    </html>
  );
}
