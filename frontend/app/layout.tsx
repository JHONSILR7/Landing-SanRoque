import type { Metadata } from "next";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import GoogleProvider from "@/components/GoogleProvider";
import { CartProvider } from "@/context/CartContext";
import FloatingCartButton from "@/components/landing/FloatingCartButton";

export const metadata: Metadata = {
  title: "San Roque",
  description: "La mejor cafetería y pastelería de la ciudad",
  icons: {
    icon: '/logo.png',
  },
  other: {
    "X-UA-Compatible": "IE=edge",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <Script
          async
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <CartProvider>
          <GoogleProvider>
            {children}
          </GoogleProvider>
          
          <FloatingCartButton />
        </CartProvider>

        <BootstrapClient />
      </body>
    </html>
  );
}