// components/dashboard/useMonthlyExpenses.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { startOfMonth, subMonths } from "date-fns";
import { calculateTrend } from "@/utils/calculateTrend";
import { DataState } from "../types/types";

export function useMonthlyExpenses(userId: string) {
  const [data, setData] = useState<DataState>({
    value: 0,
    change: 0,
    trend: "neutral",
  });

  useEffect(() => {
    if (!userId) return;

    const monthStart = startOfMonth(new Date()).getTime();
    const prevMonthStart = startOfMonth(subMonths(new Date(), 1)).getTime();

    const unsub = onSnapshot(
      collection(db, "users", userId, "expenses"),
      (snapshot) => {
        let thisMonth = 0;
        let lastMonth = 0;

        snapshot.docs.forEach((doc) => {
          const expense = doc.data();
          const amount = expense.amount || 0;

          // Handle both possible date formats
          const dateValue = expense.date || expense.createdAt;
          let millis = 0;

          if (dateValue instanceof Timestamp) millis = dateValue.toMillis();
          else if (typeof dateValue === "string") millis = new Date(dateValue).getTime();
          else if (typeof dateValue === "number") millis = dateValue;

          // Categorize by month
          if (millis >= monthStart) {
            thisMonth += amount;
          } else if (millis >= prevMonthStart && millis < monthStart) {
            lastMonth += amount;
          }
        });

        const { change, trend } = calculateTrend(thisMonth, lastMonth);
        setData({ value: thisMonth, change, trend });
      }
    );

    return () => unsub();
  }, [userId]);

  return data;
}
