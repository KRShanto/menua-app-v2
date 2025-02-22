import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ComboView from "./components/ComboView";
import CategoryPage from "./components/CategoryPage";
import MenuCart from "./components/MenuCart";
import OrderHistory from "./components/OrderHistory";
import Home from "./pages/Home";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/combo" element={<ComboView />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/cart" element={<MenuCart />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
