import HomeNavigation from "./components/HomeNavigation";
import Header from "./components/Header";
import DiscountSection from "./components/DiscountSection";
// import HeaderSearch from "./components/HeaderSearch";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  onViewChange: (view: "menu" | "combo") => void;
  children: React.ReactNode;
}

export default function Layout({ children, onViewChange }: LayoutProps) {
  const location = useLocation();

  const showHomeSection = location.pathname === "/";

  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="mx-auto max-w-2xl pb-20">
        {showHomeSection && (
          <>
            {/* <HeaderSearch /> */}
            <DiscountSection />
            <HomeNavigation onViewChange={onViewChange} />
          </>
        )}
        {children}
      </main>
    </div>
  );
}
