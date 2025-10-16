// components/dashboard/useBudgetLeft.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { startOfMonth, subMonths } from "date-fns";
import { calculateTrend } from "@/utils/calculateTrend";

export function useBudgetLeft(userId: string) {
  const [data, setData] = useState({
    value: 0,
    change: 0,
    trend: "neutral" as "up" | "down" | "neutral",
  });

  useEffect(() => {
    if (!userId) return;

    let unsubscribeExpenses: (() => void) | null = null;

    const fetchData = async () => {
      try {
        // Get the user's monthly budget
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const monthlyBudget = userSnap.exists()
          ? userSnap.data().monthlyBudget || 0
          : 0;

        const monthStart = startOfMonth(new Date()).getTime();
        const prevMonthStart = startOfMonth(subMonths(new Date(), 1)).getTime();

        // Listen to expense updates in real-time
        unsubscribeExpenses = onSnapshot(
          collection(db, "users", userId, "expenses"),
          (snapshot) => {
            let thisMonth = 0;
            let lastMonth = 0;

            snapshot.docs.forEach((doc) => {
              const expense = doc.data();
              const amount = expense.amount || 0;

              // Handle both Firestore Timestamps and ISO strings
              const dateValue = expense.date || expense.createdAt;
              let millis = 0;

              if (dateValue instanceof Timestamp) millis = dateValue.toMillis();
              else if (typeof dateValue === "string")
                millis = new Date(dateValue).getTime();
              else if (typeof dateValue === "number") millis = dateValue;

              if (millis >= monthStart) thisMonth += amount;
              else if (millis >= prevMonthStart && millis < monthStart)
                lastMonth += amount;
            });

            const thisLeft = monthlyBudget - thisMonth;
            const lastLeft = monthlyBudget - lastMonth;

            const { change, trend } = calculateTrend(thisLeft, lastLeft);
            setData({ value: thisLeft, change, trend });
          }
        );
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchData();

    // ✅ Proper cleanup to prevent memory leaks
    return () => {
      if (unsubscribeExpenses) unsubscribeExpenses();
    };
  }, [userId]);

  return data;
}
