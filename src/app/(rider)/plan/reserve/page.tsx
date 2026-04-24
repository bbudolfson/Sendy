"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";

export default function ReservePage() {
  const router = useRouter();
  const { patch, session } = usePocSession();

  if (!session.bikeId) {
    return (
      <PocCard>
        <PocStack gap="md">
          <PocH1>Reserve</PocH1>
          <PocMuted>Pick a bike from matches first.</PocMuted>
          <Link href="/plan/bikes">Back to bikes</Link>
        </PocStack>
      </PocCard>
    );
  }

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Add-ons</PocH1>
        <PocMuted>Optional helmet, pads, pedals — skip anything you don’t need.</PocMuted>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            patch({
              addOns: {
                helmetSize: String(fd.get("helmet") ?? "") || undefined,
                padSpec: String(fd.get("pads") ?? "") || undefined,
                pedalType: String(fd.get("pedals") ?? "") || undefined,
              },
            });
            router.push("/plan/accept");
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>Helmet size (optional)</PocLabel>
              <PocInput name="helmet" placeholder="M — skip if bringing your own" />
            </div>
            <div>
              <PocLabel>Pads (optional)</PocLabel>
              <PocInput name="pads" placeholder="Knee L / skip" />
            </div>
            <div>
              <PocLabel>Pedals (optional)</PocLabel>
              <PocInput name="pedals" placeholder="SPD / flat / skip" />
            </div>
            <PocButton type="submit">Continue to accept</PocButton>
            <PocButton type="button" variant="ghost" onClick={() => router.push("/plan/accept")}>
              Skip add-ons
            </PocButton>
          </PocStack>
        </form>
      </PocStack>
    </PocCard>
  );
}
