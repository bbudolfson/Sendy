import { redirect } from "next/navigation";

/** Match list moved to the dashboard; keep route for old links. */
export default function PlanBikesPage() {
  redirect("/dashboard");
}
