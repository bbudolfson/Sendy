import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccountCreationTile } from "./AccountCreationTile";

const meta = {
  title: "UI/Account Creation Tile",
  component: AccountCreationTile,
  parameters: {
    layout: "padded",
  },
  args: {
    profileComplete: false,
    paymentComplete: false,
    fleetComplete: false,
    profileHref: "#profile",
    paymentsHref: "#payments",
    fleetHref: "#fleet",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccountCreationTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIncomplete: Story = {};

export const ProfileDone: Story = {
  args: {
    profileComplete: true,
    paymentComplete: false,
    fleetComplete: false,
  },
};

export const ProfileAndPaymentDone: Story = {
  args: {
    profileComplete: true,
    paymentComplete: true,
    fleetComplete: false,
  },
};

export const AllComplete: Story = {
  args: {
    profileComplete: true,
    paymentComplete: true,
    fleetComplete: true,
  },
};
