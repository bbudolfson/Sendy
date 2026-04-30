import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StravaConnectSection } from "@/components/strava-connect-section";

const meta = {
  title: "Integrations/Strava Connect",
  component: StravaConnectSection,
  parameters: {
    layout: "padded",
  },
  args: {
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "compact"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StravaConnectSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    variant: "compact",
  },
};
