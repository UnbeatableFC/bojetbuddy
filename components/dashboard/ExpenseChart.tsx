"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useTheme } from "next-themes";

interface Expense {
  amount: number;
  date: string | number | Timestamp;
}

interface Props {
  userId: string;
}

const ExpenseChart = ({ userId }: Props) => {
  const { theme } = useTheme();
  const [data, setData] = useState<
    { name: string; amount: number }[]
  >([]);

  useEffect(() => {
    if (!userId) return;

    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday as start of week
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      addDays(start, i)
    );

    const unsub = onSnapshot(
      collection(db, "users", userId, "expenses"),
      (snapshot) => {
        const dailyTotals: Record<string, number> = {};

        weekDays.forEach((day) => {
          dailyTotals[format(day, "EEE")] = 0;
        });

        snapshot.docs.forEach((doc) => {
          const exp = doc.data() as Expense;

          let dateValue: Date | null = null;
          if (exp.date instanceof Timestamp) {
            dateValue = exp.date.toDate();
          } else if (
            typeof exp.date === "string" ||
            typeof exp.date === "number"
          ) {
            dateValue = new Date(exp.date);
          }

          if (!dateValue) return;

          // Only consider this week's expenses
          weekDays.forEach((day) => {
            if (isSameDay(day, dateValue!)) {
              const dayName = format(day, "EEE");
              dailyTotals[dayName] += exp.amount || 0;
            }
          });
        });

        const chartData = weekDays.map((day) => ({
          name: format(day, "EEE"),
          amount: dailyTotals[format(day, "EEE")] || 0,
        }));

        setData(chartData);
      }
    );

    return () => unsub();
  }, [userId]);

  return (
    <Card className="relative overflow-hidden border border-blue-100 dark:border-slate-800 bg-gradient-to-br from-blue-50 via-white to-blue-100/30 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#1E293B] shadow-md hover:shadow-lg transition-all duration-300">
      {/* soft gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-transparent pointer-events-none" />

      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Weekly Spending Trend
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(148, 163, 184, 0.2)"
            />
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill:
                  theme === "dark"
                    ? "white"
                    : "hsl(var(--muted-foreground))",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: "var(--y-axis-color)",
              }}
              axisLine={false}
              tickLine={false}
              className="dark:text-white"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#111827", fontWeight: 500 }}
              labelStyle={{ color: "#2563EB", fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="url(#colorGradient)"
              strokeWidth={3}
              dot={{ fill: "#0A74DA", r: 5 }}
              activeDot={{ r: 7, fill: "#083D77", strokeWidth: 2 }}
            />
            <defs>
              <linearGradient
                id="colorGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#0A74DA"
                  stopOpacity={0.9}
                />
                <stop
                  offset="100%"
                  stopColor="#60A5FA"
                  stopOpacity={0.5}
                />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
