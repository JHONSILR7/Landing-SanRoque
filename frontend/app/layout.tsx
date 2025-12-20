import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import GoogleProvider from "@/components/GoogleProvider";

export const metadata: Metadata = {
  title: "San Roque - Cafetería y Pastelería",
  description: "La mejor cafetería y pastelería de la ciudad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <GoogleProvider>
          {children}
        </GoogleProvider>

        <BootstrapClient />
      </body>
    </html>
  );
}