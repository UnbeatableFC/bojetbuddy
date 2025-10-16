// components/dashboard/useAverageDaily.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { startOfMonth, subMonths, differenceInDays } from "date-fns";
import { calculateTrend } from "@/utils/calculateTrend";

export function useAverageDaily(userId: string) {
  const [data, setData] = useState({
    value: 0,
    change: 0,
    trend: "neutral" as "up" | "down" | "neutral",
  });

  useEffect(() => {
    if (!userId) return;

    const now = new Date();
    const monthStart = startOfMonth(now).getTime();
    const prevMonthStart = startOfMonth(subMonths(now, 1)).getTime();

    const daysPassed = differenceInDays(now, startOfMonth(now)) || 1;
    const prevMonthDays =
      differenceInDays(startOfMonth(now), startOfMonth(subMonths(now, 1))) || 1;

    const unsub = onSnapshot(
      collection(db, "users", userId, "expenses"),
      (snapshot) => {
        let thisMonthTotal = 0;
        let prevMonthTotal = 0;

        snapshot.docs.forEach((doc) => {
          const expense = doc.data();
          const amount = expense.amount || 0;

          // Handle both Firestore Timestamps and ISO strings
          const dateValue = expense.date || expense.createdAt;
          let millis = 0;

          if (dateValue instanceof Timestamp) millis = dateValue.toMillis();
          else if (typeof dateValue === "string") millis = new Date(dateValue).getTime();
          else if (typeof dateValue === "number") millis = dateValue;

          if (millis >= monthStart) thisMonthTotal += amount;
          else if (millis >= prevMonthStart && millis < monthStart)
            prevMonthTotal += amount;
        });

        const currentAvg = thisMonthTotal / daysPassed;
        const prevAvg = prevMonthTotal / prevMonthDays;

        const { change, trend } = calculateTrend(currentAvg, prevAvg);
        setData({ value: currentAvg, change, trend });
      }
    );

    return () => unsub();
  }, [userId]);

  return data;
}
