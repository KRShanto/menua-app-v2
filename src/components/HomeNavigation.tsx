import React from "react";

interface NavigationProps {
  onViewChange: (view: "menu" | "combo") => void;
}
export default function HomeNavigation({
  onViewChange,
}: NavigationProps) {
  return (
    <div className="flex gap-2 p-4 bg-white border-b">
      <button onClick={() => onViewChange("menu")}>Menu</button>
      <button onClick={() => onViewChange("combo")}>Combo</button>
    </div>
  );
}
