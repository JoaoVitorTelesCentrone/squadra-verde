import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Squadra Verde · Beach Tênis",
  description: "Rankings de beach tênis Squadra Verde — Masculino, Feminino Bronze e Feminino Prata · Temporada 2025",
  icons: {
    icon: '/logo-squadra.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" style={{ scrollBehavior: 'smooth' }}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5efe6', fontFamily: "'DM Mono', monospace" }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
