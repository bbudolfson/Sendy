import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "UI/Empty State",
  component: EmptyState,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rider search — no bikes in the selected area. */
export const NoBikesAvailable: Story = {
  args: {
    title: "Bummer, No Bikes Available Yet.",
    description:
      "We’re new and working on getting bikes up here as our community grows. Please check back later.",
    actions: [{ label: "Clear Filters", onClick: fn() }],
  },
};

/** Shop reservations — nothing on the schedule today. */
export const NoReservationsToday: Story = {
  args: {
    title: "No Reservations Today.",
    description:
      "Give a shout out to your rentals on social media and we’ll help get more Freewheelers in your door.",
    actions: [
      { label: "Share on Facebook", href: "https://facebook.com/sharer/sharer.php" },
      { label: "Share on Instagram", href: "https://instagram.com" },
    ],
  },
};

export const NoActions: Story = {
  args: {
    title: "Nothing here yet.",
    description: "Check back soon — new listings are added regularly.",
    actions: [],
  },
};

export const Set: Story = {
  args: {
    title: "Bummer, No Bikes Available Yet.",
    description:
      "We’re new and working on getting bikes up here as our community grows. Please check back later.",
  },
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", width: "100%", maxWidth: "50rem", margin: "0 auto" }}>
      <EmptyState
        title="Bummer, No Bikes Available Yet."
        description="We’re new and working on getting bikes up here as our community grows. Please check back later."
        actions={[{ label: "Clear Filters", onClick: fn() }]}
      />
      <EmptyState
        title="No Reservations Today."
        description="Give a shout out to your rentals on social media and we’ll help get more Freewheelers in your door."
        actions={[
          { label: "Share on Facebook", href: "https://facebook.com/sharer/sharer.php" },
          { label: "Share on Instagram", href: "https://instagram.com" },
        ]}
      />
    </div>
  ),
};
