import type { ReactNode } from "react";
import { RenterShell } from "@/components/renter-shell";
import { RenterSessionProvider } from "@/context/renter-session";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <RenterSessionProvider><RenterShell>{children}</RenterShell></RenterSessionProvider>;
}
