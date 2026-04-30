import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BikeTile } from "./BikeTile";

const SAMPLE = {
  imageUrl:
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1800&q=80",
  title: "Santa Cruz Nomad",
  priceLine: "($200 Per Day)",
  hostedBy: "Bike Shop",
  typeLabel: "Mountain",
};

const meta = {
  title: "UI/Bike Tile",
  component: BikeTile,
  parameters: {
    layout: "padded",
  },
  args: SAMPLE,
  tags: ["autodocs"],
} satisfies Meta<typeof BikeTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GridSet: Story = {
  args: {
    ...SAMPLE,
  },
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))" }}>
      <BikeTile
        imageUrl={SAMPLE.imageUrl}
        title="Santa Cruz Nomad"
        priceLine="($200 Per Day)"
        hostedBy="Bike Shop"
        typeLabel="Mountain"
      />
      <BikeTile
        imageUrl="https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1800&q=80"
        title="Specialized Diverge"
        priceLine="($165 Per Day)"
        hostedBy="Outpost Bikes"
        typeLabel="Gravel"
      />
      <BikeTile
        imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=80"
        title="Trek Domane"
        priceLine="($145 Per Day)"
        hostedBy="Ridge Cycles"
        typeLabel="Road"
      />
    </div>
  ),
};
