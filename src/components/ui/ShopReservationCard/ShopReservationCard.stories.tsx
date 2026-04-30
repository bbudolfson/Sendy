import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ShopReservationCard } from "./ShopReservationCard";

const BASE = {
  bikeTitle: "Santa Cruz Nomad",
  priceLine: "($200 Per Day)",
  requestedBy: "Brett Budolfson",
  email: "bbudolfson@gmail.com",
  phone: "(555) 332-2230",
  bikeDetailsLine: "Bike: Santa Cruz Nomad, Large, No helmet",
  pickupLine: "Pickup: May 3 2026",
  returnLine: "Return: May 6 2026",
  editDefaults: {
    bikeSize: "Large",
    helmetSize: "None",
    pickupDate: "2026-05-03",
    returnDate: "2026-05-06",
  },
  totalChargesLine: "Total Charges: $475.00 (3 days + Accessories)",
  onEdit: fn(),
  onApprove: fn(),
  onDecline: fn(),
  onPickedUp: fn(),
};

const meta = {
  title: "UI/Shop Reservation Card",
  component: ShopReservationCard,
  parameters: {
    layout: "padded",
  },
  args: BASE,
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["pending", "approved", "declined"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShopReservationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: "pending",
  },
};

export const Approved: Story = {
  args: {
    status: "approved",
    totalChargesLine: "Total Charges: $475.00",
  },
};

export const Declined: Story = {
  args: {
    status: "declined",
    totalChargesLine: "Total Charges: $475.00",
    declineReasonLine: "Reason: Shop worker enters a note when closing out a request.",
  },
};

export const Set: Story = {
  args: {
    ...BASE,
    status: "pending",
  },
  render: () => (
    <div style={{ display: "grid", gap: "1rem", width: "100%", maxWidth: "80rem", margin: "0 auto" }}>
      <ShopReservationCard status="pending" {...BASE} />
      <ShopReservationCard {...BASE} status="approved" totalChargesLine="Total Charges: $475.00" />
      <ShopReservationCard
        {...BASE}
        status="declined"
        totalChargesLine="Total Charges: $475.00"
        declineReasonLine="Reason: Shop worker enters a note when closing out a request."
      />
    </div>
  ),
};
