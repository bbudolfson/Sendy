import type { Metadata } from "next";
import "./globals.css";
import { PocSessionProvider } from "@/context/poc-session";
import { RiderAuthSync } from "@/components/rider-auth-sync";
import { SupabaseProvider } from "@/context/supabase-provider";

export const metadata: Metadata = {
  title: "Sendy — Bike rentals",
  description: "Premium bike rentals for riders and shops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <PocSessionProvider>
            <RiderAuthSync />
            {children}
          </PocSessionProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
