import { Link } from "react-router-dom";

export type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  emoji?: string;
};

type CartProps = {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
};

function Cart({ cartItems, onUpdateQuantity, onRemoveItem }: CartProps) {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace("R", ""));
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center p-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient"></div>

      <div className="relative z-10 w-full max-w-4xl mt-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Shop</span>
          </Link>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl shadow-glow">
            <span className="text-3xl">🛒</span>
          </div>
        </div>

        <div className="glass-morphism rounded-3xl shadow-glass border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white py-6 px-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-accent-400/20 animate-shimmer shimmer-bg"></div>
            <h1 className="relative text-3xl font-display font-bold text-shadow">Shopping Cart</h1>
            <p className="relative text-primary-100 mt-2">
              {cartItems.length === 0 ? "Your cart is empty" : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in cart`}
            </p>
          </div>

          <div className="p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 opacity-50">🛒</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some items from the shop to get started!</p>
                <Link
                  to="/"
                  className="inline-block bg-gradient-to-r from-primary-500 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-glass flex items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl shadow-inner-glow">
                        {item.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-base mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xl font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">
                          {item.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-lg font-semibold text-gray-800">R{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="text-lg font-semibold text-gray-800">R50.00</span>
                  </div>
                  <div className="border-t border-primary-200 my-4"></div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      R{(calculateTotal() + 50).toFixed(2)}
                    </span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-primary-500 to-accent-600 text-white py-4 rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
