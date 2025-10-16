import {
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ExpenseChart from "./ExpenseChart";
import CategoryBreakdown from "./CategoryBreakdown";
import { useUser } from "@clerk/nextjs";
import { useTotalExpenses } from "@/hooks/useTotalExpenses";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import { useAverageDaily } from "@/hooks/useAverageDaily";
import { useBudgetLeft } from "@/hooks/useBudgetLeft";

const DashboardOverview = () => {
  const { user } = useUser();
  const userId = user?.id || "";

  const total = useTotalExpenses(userId);
  const monthly = useMonthlyExpenses(userId);
  const average = useAverageDaily(userId);
  const budgetLeft = useBudgetLeft(userId);

  const stats = [
    { title: "Total Expenses", data: total, icon: DollarSign },
    { title: "This Month", data: monthly, icon: CreditCard },
    { title: "Average Daily", data: average, icon: TrendingUp },
    { title: "Budget Left", data: budgetLeft, icon: TrendingDown },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border border-border/60 bg-card/80 backdrop-blur-md 
             transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50"
          >
           { /* Soft gradient glow effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                ₦{stat.data.value.toFixed(2)}
              </div>
              <p
                className={`text-xs mt-1 font-medium flex items-center gap-1 ${
                  stat.data.trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : stat.data.trend === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {stat.data.change > 0 && "+"}
                {stat.data.change.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseChart userId={userId} />
        <CategoryBreakdown userId={userId} />
      </div>

      {/* Suggestions Card */}
      {/* <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="font-heading">
            💡 Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <p className="font-medium text-foreground">
                Reduce dining expenses
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;ve spent 30% more on dining out this month.
                Consider meal prepping to save $150.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <p className="font-medium text-foreground">
                Entertainment budget alert
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;re approaching your entertainment budget
                limit. $80 remaining for this month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default DashboardOverview;
