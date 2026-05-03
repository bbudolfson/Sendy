import type { ReactNode } from "react";
import { ShopAppChrome } from "@/components/shop-app-chrome";
import { ShopSessionProvider } from "@/context/shop-session";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <ShopSessionProvider>
      <ShopAppChrome>{children}</ShopAppChrome>
    </ShopSessionProvider>
  );
}
