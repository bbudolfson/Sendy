import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PocCard, PocCheckbox, PocInput, PocLabel, PocStack } from "@/components/poc-ui";

function InputStatesShowcase() {
  return (
    <PocCard>
      <PocStack gap="md">
        <div>
          <PocLabel>Email</PocLabel>
          <PocInput placeholder="Enter email address" />
        </div>
        <div>
          <PocLabel>Email</PocLabel>
          <PocInput defaultValue="bbudolf@g" />
        </div>
        <div>
          <PocLabel>Email</PocLabel>
          <PocInput defaultValue="bbudolf@gmail.com" />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PocCheckbox defaultChecked />
          Send me availability updates
        </label>
      </PocStack>
    </PocCard>
  );
}

const meta = {
  title: "UI/Inputs",
  component: InputStatesShowcase,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputStatesShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {};
