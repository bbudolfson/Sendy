import type { Metadata } from "next";
import "./globals.css";
import { PocSessionProvider } from "@/context/poc-session";

export const metadata: Metadata = {
  title: "Sendy — Bike rentals",
  description: "Proof-of-concept rider flows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PocSessionProvider>{children}</PocSessionProvider>
      </body>
    </html>
  );
}
