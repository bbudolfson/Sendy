import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pill } from "./Pill";

const meta = {
  title: "UI/Pill",
  component: Pill,
  parameters: {
    layout: "padded",
  },
  args: {
    size: "md",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["error", "success", "pending", "neutral"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    variant: "error",
    children: "ERROR",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "SUCCESS",
  },
};

export const Pending: Story = {
  args: {
    variant: "pending",
    children: "PENDING",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "Mountain",
  },
};

export const Set: Story = {
  args: { children: "PENDING" },
  render: () => (
    <div style={{ display: "grid", gap: "2rem", width: "100%", maxWidth: "52rem", margin: "0 auto" }}>
      <Pill variant="error">ERROR</Pill>
      <Pill variant="success">SUCCESS</Pill>
      <Pill variant="pending">PENDING</Pill>
      <Pill variant="neutral">Mountain</Pill>
    </div>
  ),
};
