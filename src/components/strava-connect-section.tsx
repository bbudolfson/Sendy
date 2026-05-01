"use client";

import { PocButton, PocMuted, PocStack } from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import styles from "./strava-connect-section.module.css";

type Props = {
  /** Shorter copy for auth modal */
  variant?: "default" | "compact";
};

export function StravaConnectSection({ variant = "default" }: Props) {
  const { session, patch } = usePocSession();
  const compact = variant === "compact";

  return (
    <div className={styles.wrap} data-compact={compact || undefined}>
      <PocStack gap="sm">
        {session.stravaConnected ? (
          <>
            <p className={styles.status}>Strava connected</p>
            <PocButton
              type="button"
              variant="secondary"
              fullWidth={compact}
              onClick={() => patch({ stravaConnected: false })}
            >
              Disconnect Strava
            </PocButton>
          </>
        ) : (
          <PocButton type="button" variant="secondary" fullWidth={compact} onClick={() => patch({ stravaConnected: true })}>
            Connect Strava
          </PocButton>
        )}
        {compact ? (
          <PocMuted>
            OAuth not wired yet — this toggles demo state. See Strava docs for available data.
          </PocMuted>
        ) : (
          <>
            <PocMuted>
              With user consent, Strava’s API can expose profile basics, recent activities
              (distance, elevation, sport type), and—depending on scopes—streams like heart rate
              and power for matching and trust signals. Review scopes in the official reference.
            </PocMuted>
            <a
              className={styles.docLink}
              href="https://developers.strava.com/docs/reference/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Strava API reference
            </a>
          </>
        )}
      </PocStack>
    </div>
  );
}
