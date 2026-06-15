import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/ContactPage";
import CollectionsPage from "./pages/CollectionsPage";
import SignUpPage from "./pages/SignUpPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Orders from "./pages/Orders";
import TrackOrderPage from "./pages/TrackOrderPage";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import WishlistPage from "./pages/WishlistPage";
import { useAppContext } from "./context/AppContext";
import ProfilePage from "./pages/ProfilePage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
}

function App() {
  const { user, isAuthReady } = useAppContext();

  if (!isAuthReady) return null;

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collection" element={<CollectionsPage />} />
        <Route path="/products/:_id" element={<ProductPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Auth routes — redirect to home if already logged in */}
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to="/" />}
        />

        {/* Protected routes — redirect to signup if not logged in */}
        <Route
          path="/profile"
          element={
            user ? <ProfilePage /> : <Navigate to="/signup?mode=login" />
          }
        />
        <Route
          path="/wishlist"
          element={
            user ? <WishlistPage /> : <Navigate to="/signup?mode=login" />
          }
        />
        <Route
          path="/cart"
          element={user ? <CartPage /> : <Navigate to="/signup?mode=login" />}
        />
        <Route
          path="/checkout"
          element={user ? <Checkout /> : <Navigate to="/signup?mode=login" />}
        />
        <Route
          path="/orders"
          element={user ? <Orders /> : <Navigate to="/signup?mode=login" />}
        />
        <Route
          path="/order-success"
          element={
            user ? <OrderSuccessPage /> : <Navigate to="/signup?mode=login" />
          }
        />
        <Route
          path="/trackorder/:_id"
          element={
            user ? <TrackOrderPage /> : <Navigate to="/signup?mode=login" />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
