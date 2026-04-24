# Rider flows (summary)

Canonical detail lives in Notion; this file tracks route parity for the Next.js app.

## Auth & FTUE

- `/` landing → `/sign-in` or `/create-account`
- `/ftue/profile` → `/ftue/bikes` → `/ftue/riding-style` → `/rider-profile` → `/dashboard`

## Trip planning

- `/plan/trip-details` (location required; dates & riders optional)
- `/plan/request-market` when no coverage
- `/plan/browse` → `/plan/select-market` when destination unknown
- `/plan/dates` when dates still needed
- `/plan/bikes` → `/plan/bikes/[id]` → `/plan/reserve` → `/plan/accept`
- `/plan/pickup-only` when the market has no delivery

## Delivery (markets with delivery only, after Accept)

- `/delivery/method` → `/delivery/address-check` → `/delivery/address` or `/delivery/disclaim` → `/delivery/location-type` (address path) → `/delivery/window` → `/delivery/return-pickup` → optional `/delivery/pickup-price` + `/delivery/cancellation`

## Checkout

- `/checkout` routes to saved vs new card entry
- `/checkout/payment/confirm` → `/checkout/payment/ccv` → `/checkout/confirm` → `/checkout/success`

Insurance is intentionally out of scope until the product flow defines it.
