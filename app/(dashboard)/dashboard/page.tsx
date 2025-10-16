"use client";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { syncUserToFirebase } from "@/lib/syncUserToFirebase";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && isLoaded && user) {
      syncUserToFirebase(user);
    }
  }, [isSignedIn, isLoaded, user]);
  return (
    <div className="flex flex-col px-2 space-y-3">
      <div className="flex flex-col items-start justify-between gap-3 text-primary">
        <h5 className="text-4xl uppercase font-bold font-raleway">
          Your Dashboard
        </h5>
        <p className="text-2xl">
          Welcome back,
          <span className="uppercase italic font-semibold">
            {user?.firstName}
          </span>{" "}
          !
        </p>
      </div>
      <DashboardOverview />
    </div>
  );
};

export default Dashboard;
