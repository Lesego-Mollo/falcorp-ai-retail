import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Cart from "./Cart.tsx";
import Help from "./Help.tsx";
import Browse from "./Browse.tsx";
import Prices from "./Prices.tsx";
import Orders from "./Orders";
import LoginPage from "./LoginPage.tsx";
import SignupPage from "./SignupPage.tsx";
import type { CartItem } from "./Cart";
import Checkout from "./Checkout.tsx";
import type { GroceryItem } from "./types"; // ✅ Add this line


// ---------------------- //
// 🧭 TopBar Component
// ---------------------- //
function TopBar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/30 shadow-sm flex items-center justify-between px-6 py-3">
      <Link to="/" className="text-xl font-bold text-primary-700 hover:text-accent-600 transition-colors">
        🛒 Falcorp AiButler
      </Link>

      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/orders" className="text-sm font-medium text-primary-600 hover:text-accent-600 transition-colors">
              Orders
            </Link>
            <span className="text-gray-600 text-sm font-medium">
              👋 Hi, {user.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow hover:scale-105 transition-transform"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-semibold text-primary-600 hover:text-accent-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow hover:scale-105 transition-transform"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

// ---------------------- //
// 🛍 Root Component
// ---------------------- //
function Root() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: GroceryItem) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user) {
      alert("⚠️ Please log in to add items to your cart.");
      window.location.href = "/login";
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Support re-order flow: if Orders page set `reorderItems` in localStorage,
  // add them to the cart on next app load and clear the flag.
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("reorderItems") || "null");
      if (Array.isArray(stored) && stored.length > 0) {
        stored.forEach((it: any) => {
          handleAddToCart({
            id: it.id || `item_${Date.now()}`,
            category: it.category || "Restored",
            name: it.name,
            price: it.price || "R0.00",
            stock: Number(it.stock) || 1,
            emoji: it.emoji || "🛒",
          });
        });
        localStorage.removeItem("reorderItems");
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleUpdateQuantity = (id: string, quantity: number) =>
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

  const handleRemoveItem = (id: string) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <BrowserRouter>
      <TopBar /> {/* ✅ Always visible at the top */}
      <div className="pt-16"> {/* ✅ Add padding so content doesn't overlap navbar */}
        <Routes>
          <Route
            path="/"
            element={<App cartItems={cartItems} onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            }
          />
          <Route path="/help" element={<Help />} />
          <Route
            path="/browse"
            element={
              <Browse
                onAddToCart={handleAddToCart}
                cartItemCount={cartItems.length}
              />
            }
          />
          <Route
    path="/checkout"
    element={<Checkout onClearCart={() => setCartItems([])} />} // ✅ Added this line
  />
  <Route path="/help" element={<Help />} />
  <Route
    path="/browse"
    element={
      <Browse
        onAddToCart={handleAddToCart}
        cartItemCount={cartItems.length}
      />
    }
  />
          <Route
            path="/prices"
            element={<Prices cartItemCount={cartItems.length} />}
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
