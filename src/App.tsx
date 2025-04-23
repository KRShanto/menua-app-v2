import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage";
import MenuCart from "./pages/MenuCart";
import OrderHistory from "./pages/OrderHistory";
import Home from "./pages/Home";
import Header from "./components/Header";
import PaymentNotDone from "./components/PaymentNotDone";
import { useEffect } from "react";
import { useDataStore } from "./stores/data";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./components/Footer";

const App = () => {
  const { fetchData } = useDataStore();
  const showPaymentNotDone = false;

  useEffect(() => {
    // Fetch firebase data
    fetchData();
  }, [fetchData]);

  if (showPaymentNotDone) {
    return <PaymentNotDone />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/cart" element={<MenuCart />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
      </Routes>
      <Footer />
      <Analytics />
    </Router>
  );
};

export default App;
