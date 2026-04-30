import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ShopInventoryCard } from "./ShopInventoryCard";

const BASE = {
  imageUrl:
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1800&q=80",
  title: "Santa Cruz Nomad",
  bikeLine: "Bike: Santa Cruz Nomad",
  sizeLine: "Size: Large",
  specsLine: "Specs: Shimano",
  rateLine: "Rate: $200 Full Day | $125 Half Day",
  bikeValue: "Santa Cruz Nomad",
  sizeValue: "Large",
  specsValue: "Shimano",
  rateValue: "$200 Full Day | $125 Half Day",
  onBikeValueChange: fn(),
  onSizeValueChange: fn(),
  onSpecsValueChange: fn(),
  onRateValueChange: fn(),
  onEdit: fn(),
  onDuplicate: fn(),
  onRemove: fn(),
  onCancel: fn(),
  onSave: fn(),
};

const meta = {
  title: "UI/Shop Inventory Card",
  component: ShopInventoryCard,
  parameters: {
    layout: "padded",
  },
  args: BASE,
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["view", "edit"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShopInventoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
  args: {
    mode: "view",
  },
};

export const Edit: Story = {
  args: {
    mode: "edit",
  },
};

export const Set: Story = {
  args: {
    ...BASE,
  },
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", width: "100%", maxWidth: "64rem", margin: "0 auto" }}>
      <ShopInventoryCard {...BASE} mode="view" />
      <ShopInventoryCard {...BASE} mode="edit" />
    </div>
  ),
};
