"use client";

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

export default function CreateAccountPage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Create account</PocH1>
        <PocMuted>Dummy form — submits go straight to sign-in.</PocMuted>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/sign-in");
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>Email</PocLabel>
              <PocInput name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div>
              <PocLabel>Password</PocLabel>
              <PocInput name="password" type="password" required minLength={4} />
            </div>
            <PocButton type="submit">Create account</PocButton>
          </PocStack>
        </form>
        <a href="/sign-in" style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Already have an account? Sign in
        </a>
      </PocStack>
    </PocCard>
  );
}
