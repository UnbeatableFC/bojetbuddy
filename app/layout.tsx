import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BojetBuddy",
  description:
    "A smart expense tracker for users to manage their finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TooltipProvider>
        <html
          lang="en"
          className={`${inter.variable} ${raleway.variable}`}
          suppressHydrationWarning
        >
          <body className={`font-sans antialiased bg-accent`}>
            {children}
          </body>
          <Toaster richColors />
          <Sonner />
        </html>
      </TooltipProvider>
    </ClerkProvider>
  );
}
