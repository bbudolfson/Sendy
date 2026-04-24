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

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Forgot password</PocH1>
        <PocMuted>Stub flow: email → reset link → new password → sign in.</PocMuted>
        <div>
          <PocLabel>Email</PocLabel>
          <PocInput type="email" required />
        </div>
        <PocButton type="button" onClick={() => router.push("/sign-in")}>
          Send reset link (demo)
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
