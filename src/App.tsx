import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage";
import MenuCart from "./pages/MenuCart";
import OrderHistory from "./pages/OrderHistory";
import Home from "./pages/Home";
import Header from "./components/Header";
import { useEffect } from "react";
import { useDataStore } from "./stores/data";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const { fetchData } = useDataStore();

  useEffect(() => {
    // Fetch firebase data
    fetchData();
  }, [fetchData]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/cart" element={<MenuCart />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
      </Routes>
      <Analytics />
    </Router>
  );
};

export default App;
