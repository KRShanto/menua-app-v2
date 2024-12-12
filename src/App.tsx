import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Layout from "./Layout";
import MenuView from "./components/MenuView";
import ComboView from "./components/ComboView";
import CategoryPage from "./components/CategoryPage";
import { ViewType } from "./types/menu";
import MenuCart from "./components/MenuCart";
import OrderHistory from "./components/OrderHistory";

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
  const handleViewChange = (view: "menu" | "combo") => {
    setActiveView(view);
  };
  return (
    <Router>
      <Layout onViewChange={handleViewChange}>
        <Routes>
          <Route
            path="/"
            element={activeView === "menu" ? <MenuView /> : <ComboView />}
          />
          <Route path="/combo" element={<ComboView />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<MenuCart />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
