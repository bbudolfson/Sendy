import type { ReactNode } from "react";
import { PocRiderShell } from "@/components/poc-rider-shell";

export default function RiderLayout({ children }: { children: ReactNode }) {
  return <PocRiderShell>{children}</PocRiderShell>;
}
