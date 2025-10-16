// components/dashboard/useTotalExpenses.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { startOfMonth, subMonths } from "date-fns";
import { calculateTrend } from "@/utils/calculateTrend";
import { DataState } from '@/types/types';



export function useTotalExpenses(userId: string) {
 const [data, setData] = useState<DataState>({
   value: 0,
   change: 0,
   trend: "neutral"  // initial concrete value
 });

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(collection(db, "users", userId, "expenses"), (snapshot) => {
      let totalAll = 0;
      let totalPrevMonth = 0;

      const monthStart = startOfMonth(new Date()).getTime();
      const prevMonthStart = startOfMonth(subMonths(new Date(), 1)).getTime();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const amount = data.amount || 0;
        const date = data.date || 0;

        totalAll += amount;

        // for comparison: previous month’s total
        if (date >= prevMonthStart && date < monthStart) {
          totalPrevMonth += amount;
        }
      });

      const { change, trend } = calculateTrend(totalAll, totalPrevMonth);
      setData({ value: totalAll, change, trend });
    });

    return () => unsub();
  }, [userId]);

  return data;
}
