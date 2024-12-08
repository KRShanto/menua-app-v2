import HomeNavigation from "./components/HomeNavigation";
import Header from "./components/Header";
import DiscountSection from "./components/DiscountSection";

interface LayoutProps {
  children: React.ReactNode;
  onViewChange: (view: "menu" | "combo") => void;
}

export default function Layout({ children, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="mx-auto max-w-2xl pb-20">
        <DiscountSection />
        <HomeNavigation onViewChange={onViewChange} />
        {children}
      </main>
    </div>
  );
}
