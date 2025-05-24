import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safi | Sistema de Suporte para Farmácias",
  description: "Safi é a plataforma ideal para gestão e suporte operacional de farmácias, com eficiência, segurança e agilidade.",
  keywords: [
    "farmácia",
    "sistema para farmácia",
    "gestão farmacêutica",
    "atendimento",
    "suporte",
    "tecnologia para farmácias",
    "Safi",
  ],
  authors: [{ name: "Equipe Safi", url: "https://safi-ai.me" }],
  creator: "Equipe Safi",
  publisher: "Equipe Safi",
  metadataBase: new URL("https://safi-ai.me"),
  openGraph: {
    type: "website",
    url: "https://safi-ai.me",
    siteName: "Safi",
    title: "Safi | Sistema de Suporte para Farmácias",
    description: "Safi é a plataforma ideal para gestão e suporte operacional de farmácias, com eficiência, segurança e agilidade.",
    images: [
      {
        url: "https://sua-cdn.com/safi/cover.png",
        width: 1200,
        height: 630,
        alt: "Safi - Sistema para Farmácias",
      },
    ],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@safibr",
    creator: "@safibr",
    title: "Safi | Sistema de Suporte para Farmácias",
    description: "Safi é a plataforma ideal para gestão e suporte operacional de farmácias, com eficiência, segurança e agilidade.",
    images: [
      "https://sua-cdn.com/safi/cover.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <body
        className={`Montserrat antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
