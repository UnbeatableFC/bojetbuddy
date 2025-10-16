import { Trend } from "@/types/types";

// components/dashboard/utils.ts
export function calculateTrend(current: number, previous: number) {
  if (previous === 0) return { change: 0, trend: "neutral" as const };
  const change = ((current - previous) / previous) * 100;
  const trend:Trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
  return { change: Number(change.toFixed(2)), trend };
}

