"use client";

import { createContext, useContext } from "react";

export interface DashboardUser {
  email: string;
  fullName: string;
  phone: string;
  createdAt: string;
}

interface DashboardContextType {
  user: DashboardUser;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={{ user }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardUser() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardUser must be used within DashboardProvider");
  }
  return context.user;
}
