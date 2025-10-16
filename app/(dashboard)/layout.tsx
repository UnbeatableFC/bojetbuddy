"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  List,
  Menu,
  Plus,
  SettingsIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Add Expense", href: "/add", icon: Plus },
  { title: "All Expenses", href: "/expenses", icon: List },
  { title: "Settings", href: "/settings", icon: SettingsIcon },
];

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* --- Sidebar --- */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-[#0A74DA]/95 to-[#083D77]/95 border-r border-border/50 backdrop-blur-md shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/bud-logo.png"
              alt="BojetBuddy Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-lg font-heading font-bold text-white tracking-wide">
              BojetBuddy
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 mt-4 space-y-2">
          {sidebarItems.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-blue-300/20 border border-blue-400/50 shadow-sm text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-transform duration-200",
                      isActive
                        ? "text-blue-400 scale-110"
                        : "text-gray-400 group-hover:text-white group-hover:scale-105"
                    )}
                  />
                  <span className="font-medium">{item.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-5 left-0 right-0 px-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex flex-col">
              <p className="font-heading text-white font-semibold leading-tight">
                {user?.fullName || "Loading..."}
              </p>
              <p className="text-xs text-gray-300">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="ml-0 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="fixed top-0 right-0 w-full z-30 bg-gradient-to-r from-[#E6F0FA]/80 to-[#ffffff]/60 dark:from-[#041C3C]/90 dark:to-[#0E1B2B]/90 backdrop-blur-xl border-b border-border/50 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-foreground hover:bg-primary/10"
              >
                <Menu className="size-5" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <UserButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mt-[72px] px-4 lg:px-8 py-6 flex-1 bg-background transition-all">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#E6F0FA] dark:bg-[#0E1B2B] border-t border-border/40 py-6 text-center shadow-inner">
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-primary font-semibold">BojetBuddy</span>. All
            rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
