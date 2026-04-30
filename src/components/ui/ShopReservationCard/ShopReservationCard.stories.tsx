import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ShopReservationCard } from "./ShopReservationCard";

const BASE = {
  bikeTitle: "Santa Cruz Nomad",
  priceLine: "($200 Per Day)",
  requestedBy: "Brett Budolfson",
  email: "bbudolfson@gmail.com",
  phone: "(555) 332-2230",
  bikeDetailsLine: "Bike: Santa Cruz Nomad, L, Helmet",
  pickupLine: "Pickup: Sunday May 3",
  returnLine: "Return: Wednesday May 6",
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
    detailsTitle: "Request Details",
  },
};

export const Approved: Story = {
  args: {
    status: "approved",
    detailsTitle: "Request Details",
    totalChargesLine: "Total Charges: $475.00",
  },
};

export const Declined: Story = {
  args: {
    status: "declined",
    detailsTitle: "Request Declined",
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
      <ShopReservationCard status="pending" detailsTitle="Request Details" {...BASE} />
      <ShopReservationCard
        {...BASE}
        status="approved"
        detailsTitle="Request Details"
        totalChargesLine="Total Charges: $475.00"
      />
      <ShopReservationCard
        {...BASE}
        status="declined"
        detailsTitle="Request Declined"
        totalChargesLine="Total Charges: $475.00"
        declineReasonLine="Reason: Shop worker enters a note when closing out a request."
      />
    </div>
  ),
};
