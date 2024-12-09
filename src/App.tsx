import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import { ViewType } from "./types/menu";
import Layout from "./Layout";
import MenuView from "./components/MenuView";
import ComboView from "./components/ComboView";
import MenuCart from "./components/MenuCart";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>("menu");

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
    <Layout onViewChange={(view) => setActiveView(view)}>
      {/* {activeView === "menu" ? <MenuView /> : <ComboView />} */}
      <MenuCart />
    </Layout>
  );
};

export default App;
