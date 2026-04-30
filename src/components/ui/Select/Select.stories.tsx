import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  render: () => (
    <div style={{ width: "22rem" }}>
      <Select defaultValue="">
        <option value="" disabled>
          Select an option
        </option>
        <option value="road">Road</option>
        <option value="gravel">Gravel</option>
        <option value="mountain">Mountain</option>
      </Select>
    </div>
  ),
};

export const Filled: Story = {
  render: () => (
    <div style={{ width: "22rem" }}>
      <Select defaultValue="all">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
    </div>
  ),
};
