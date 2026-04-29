import type { ReactNode } from "react";
import { PocRiderShell } from "@/components/poc-rider-shell";

export default function RiderLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal?: ReactNode;
}) {
  return (
    <PocRiderShell>
      {children}
      {modal}
    </PocRiderShell>
  );
}
