import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RiderReservationCard } from "./RiderReservationCard";

function DemoCard() {
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const node = ref.current;
    if (!node) return;
    const picker = node as HTMLInputElement & { showPicker?: () => void };
    if (picker.showPicker) {
      picker.showPicker();
      return;
    }
    node.focus();
  };

  return (
    <RiderReservationCard
      bikeTitle="Santa Cruz Nomad"
      priceLine="($200 Per Day)"
      bikeTypeLabel="Mountain"
      description="Efficient trial setup with 130mm front travel and modern geo."
      bikeLine="Bike: Santa Cruz Nomad"
      sizeLine="Size: Large"
      hostedBy="Outpost Bike Shop"
      startValue={startValue}
      endValue={endValue}
      onOpenStartPicker={() => openPicker(startRef)}
      onOpenEndPicker={() => openPicker(endRef)}
      onStartChange={setStartValue}
      onEndChange={setEndValue}
      onReserve={() => {}}
      startInputRef={startRef}
      endInputRef={endRef}
    />
  );
}

const meta = {
  title: "UI/Rider Reservation Card",
  component: DemoCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Priced: Story = {
  render: () => (
    <RiderReservationCard
      bikeTitle="Santa Cruz Nomad"
      priceLine="($200 Per Day)"
      bikeTypeLabel="Mountain"
      description="Efficient trial setup with 130mm front travel and modern geo."
      bikeLine="Bike: Santa Cruz Nomad"
      sizeLine="Size: Large"
      hostedBy="Outpost Bike Shop"
      state="priced"
      startValue="2026-05-03"
      endValue="2026-05-06"
      totalChargesLine="Total Charges: $475.00 ($200 x 3 Days)"
      onOpenStartPicker={() => {}}
      onOpenEndPicker={() => {}}
      onStartChange={() => {}}
      onEndChange={() => {}}
      onReserve={() => {}}
    />
  ),
};

export const Reserved: Story = {
  render: () => (
    <RiderReservationCard
      bikeTitle="Santa Cruz Nomad"
      priceLine="($200 Per Day)"
      bikeTypeLabel="Mountain"
      description="Efficient trial setup with 130mm front travel and modern geo."
      bikeLine="Bike: Santa Cruz Nomad"
      sizeLine="Size: Large"
      hostedBy="Outpost Bike Shop"
      state="reserved"
      startValue="2026-05-03"
      endValue="2026-05-06"
      reservationBikeLine="Bike: Santa Cruz Nomad, L, Helmet"
      reservationPickupLine="Pickup: Sunday May 3"
      reservationReturnLine="Return: Wednesday May 6"
      reservationTotalLine="Total Charges: $475.00"
      onOpenStartPicker={() => {}}
      onOpenEndPicker={() => {}}
      onStartChange={() => {}}
      onEndChange={() => {}}
      onReserve={() => {}}
    />
  ),
};
