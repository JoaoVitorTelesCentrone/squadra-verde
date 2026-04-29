import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Squadra Verde · Ranking Masculino Beach Tennis",
  description: "Acompanhe o ranking Rei da Quadra do Masculino Squadra Verde — Beach Tennis Temporada 2026",
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
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8faf5', fontFamily: "'Inter', sans-serif" }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
