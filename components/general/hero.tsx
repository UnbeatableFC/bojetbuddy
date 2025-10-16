
import { SignInButton } from "@clerk/nextjs";
import { TrendingUp, PieChart, Target } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
              Track Your
              <span className="text-primary block">Student Budget</span>
              Effortlessly
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              BudgetBuddy helps students manage expenses, visualize spending patterns, 
              and make smarter financial decisions. Start saving today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
             <SignInButton>
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Start Tracking Free
                </Button>
             </SignInButton>
              <Link href="/#about">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    Real-time Tracking
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your expenses as they happen
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <Target className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    Smart Insights
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get personalized spending suggestions
                  </p>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <PieChart className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    Visual Reports
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Beautiful charts and analytics
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      This Month
                    </span>
                    <span className="text-success text-sm font-semibold">
                      -12%
                    </span>
                  </div>
                  <div className="text-3xl font-heading font-bold text-foreground">
                    $1,234
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total Expenses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
