import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RiderAvatarMenu } from "@/components/rider-avatar-menu";

const meta = {
  title: "Navigation/Rider Avatar Menu",
  component: RiderAvatarMenu,
  parameters: {
    layout: "padded",
  },
  args: {
    variant: "surface",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["surface", "hero"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RiderAvatarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {};

export const Hero: Story = {
  args: {
    variant: "hero",
  },
};
