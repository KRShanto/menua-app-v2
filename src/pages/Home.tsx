import ComboView from "@/components/ComboView";
import DiscountSection from "@/components/DiscountSection";
import HomeNavigation from "@/components/HomeNavigation";
import MenuView from "@/components/MenuView";
import SplashScreen from "@/components/SplashScreen";
import { ViewType } from "@/types/menu";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>("menu");

  const handleViewChange = (view: "menu" | "combo") => {
    setActiveView(view);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <main>
      <DiscountSection />
      <HomeNavigation onViewChange={handleViewChange} />
      {activeView === "menu" ? <MenuView /> : <ComboView />}
    </main>
  );
}
