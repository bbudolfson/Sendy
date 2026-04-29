import type { ReactNode } from "react";
import { ShopShell } from "@/components/shop-shell";
import { ShopSessionProvider } from "@/context/shop-session";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <ShopSessionProvider>
      <ShopShell>{children}</ShopShell>
    </ShopSessionProvider>
  );
}
