import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CartItem } from "./Cart";

type CheckoutState = {
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
};

type CheckoutProps = {
  onClearCart: () => void;
};

export default function Checkout({ onClearCart }: CheckoutProps) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3); // seconds

  if (!state) {
    // Redirect if user opens /checkout directly
    navigate("/cart", { replace: true });
    return null;
  }

  const { items, subtotal, delivery, total } = state as CheckoutState;

  // ⏳ Handle redirect countdown after placing order
  useEffect(() => {
    if (orderPlaced) {
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            navigate("/", { replace: true });
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [orderPlaced, navigate]);

  if (orderPlaced) {
    return (
      <div className="p-6 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          ✅ Order placed successfully!
        </h1>
        <p className="text-gray-600 text-lg">
          Thank you for your order. Redirecting to home in{" "}
          <span className="font-semibold text-primary-600">
            {redirectCountdown}
          </span>{" "}
          seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="space-y-3 mb-6">
        {items.map((it) => (
          <div key={it.id} className="flex justify-between border-b pb-2">
            <span>
              {it.name} × {it.quantity}
            </span>
            <span>{it.price}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>R{delivery.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>R{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={async () => {
            // persist order to backend if configured, otherwise localStorage
            const ORDERS_API = import.meta.env.VITE_ORDERS_API_URL as string | undefined;
            const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
            const order = {
              id: `order_${Date.now()}`,
              userId: user?.email || user?.id || "guest",
              userName: user?.name || user?.email || "Guest",
              items: items.map((it) => ({ id: it.id, name: it.name, price: it.price, quantity: it.quantity })),
              total,
              placedAt: new Date().toISOString(),
            };

            if (ORDERS_API) {
              try {
                await fetch(ORDERS_API, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(order),
                });
              } catch (err) {
                console.warn("Failed to POST order to backend, falling back to localStorage:", err);
                const all = JSON.parse(localStorage.getItem("orders") || "[]");
                all.push(order);
                localStorage.setItem("orders", JSON.stringify(all));
              }
            } else {
              try {
                const all = JSON.parse(localStorage.getItem("orders") || "[]");
                all.push(order);
                localStorage.setItem("orders", JSON.stringify(all));
              } catch (err) {
                console.warn("Could not save order to history:", err);
              }
            }

            onClearCart();
            setOrderPlaced(true);
          }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
