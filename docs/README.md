# Sendy docs

Rider screen flows are authored in Notion under **Product Design Specs → Screen Flows**:

- [Screen Flows hub](https://www.notion.so/34b0bacaf7bc81018524e5911c296574)

Mirrors in `docs/flows/` summarize the same routes for offline review. **Last mirrored:** 2026-04-24.

## Dummy data

Markets, bikes, and delivery windows live in [`src/lib/dummy-data/index.ts`](../src/lib/dummy-data/index.ts). Heuristics:

- **Moab** — delivery available; mountain/gravel bikes.
- **Bend** — pickup only; gravel/road bikes.
- **Boulder** — delivery available; mixed trip types.
- **Ghost / nowhere / nomarket** in the location field — triggers “request market”.

Session state for the POC is client-side (`PocSessionProvider`); use the footer **POC data & routes** panel to inspect or reset.
