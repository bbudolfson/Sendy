import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  PocButton,
  PocButtonLink,
  PocCard,
  PocInput,
  PocLabel,
  PocMuted,
  PocSelect,
  PocStack,
  PocTextarea,
} from "@/components/poc-ui";

function Showcase() {
  return (
    <PocCard>
      <PocStack gap="md">
        <PocMuted>Shared interactive primitives used across rider + shop flows.</PocMuted>
        <PocStack gap="sm">
          <PocButton variant="primary">Primary button</PocButton>
          <PocButton variant="secondary">Secondary button</PocButton>
          <PocButton variant="ghost">Ghost button</PocButton>
          <PocButtonLink href="#">Button link</PocButtonLink>
        </PocStack>
        <div>
          <PocLabel>Email</PocLabel>
          <PocInput placeholder="name@example.com" />
        </div>
        <div>
          <PocLabel>Bike type</PocLabel>
          <PocSelect defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option value="road">Road</option>
            <option value="gravel">Gravel</option>
            <option value="mountain">Mountain</option>
          </PocSelect>
        </div>
        <div>
          <PocLabel>Notes</PocLabel>
          <PocTextarea placeholder="Tell us your riding plans" />
        </div>
      </PocStack>
    </PocCard>
  );
}

const meta = {
  title: "Core/POC UI",
  component: Showcase,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Showcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
