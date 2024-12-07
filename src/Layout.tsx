import React from "react";

import HomeNavigation from "./components/HomeNavigation";
import Header from "./components/Header";
import WeeklySpecial from "./components/WeeklySpecial";

interface LayoutProps {
  children: React.ReactNode;
  onViewChange: (view: "menu" | "combo") => void;
}

export default function Layout({ children, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="max-w-2xl mx-auto pb-20">
        <WeeklySpecial />
        <HomeNavigation onViewChange={onViewChange} />
        {children}
      </main>
    </div>
  );
}
