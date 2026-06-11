import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GlamStudio - Peluquería & Estilismo Profesional",
    template: "%s - GlamStudio",
  },
  description:
    "Tu salón de belleza y peluquería de confianza. Cortes, coloración, tratamientos capilares y más. Reserva tu cita online.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "GlamStudio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GlamStudio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
