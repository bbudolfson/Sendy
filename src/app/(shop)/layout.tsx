import type { ReactNode } from "react";
import { ShopAppChrome } from "@/components/shop-app-chrome";
import { ShopDataSync } from "@/components/shop-data-sync";
import { ShopSessionProvider } from "@/context/shop-session";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <ShopSessionProvider>
      <ShopDataSync />
      <ShopAppChrome>{children}</ShopAppChrome>
    </ShopSessionProvider>
  );
}
