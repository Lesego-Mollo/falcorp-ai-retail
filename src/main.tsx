import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Cart from './Cart.tsx'
import Help from './Help.tsx'
import Browse from './Browse.tsx'
import Prices from './Prices.tsx'
import type { CartItem } from './Cart'

type GroceryItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  stock: number;
  emoji?: string;
};

function Root() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: GroceryItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevItems, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        emoji: item.emoji
      }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App cartItems={cartItems} onAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />} />
        <Route path="/help" element={<Help />} />
        <Route path="/browse" element={<Browse onAddToCart={handleAddToCart} cartItemCount={cartItems.length} />} />
        <Route path="/prices" element={<Prices cartItemCount={cartItems.length} />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
