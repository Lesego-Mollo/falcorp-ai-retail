import { useState, useRef, useEffect } from "react";
import type { CartItem } from "./Cart";
import { Link } from "react-router-dom";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  type?: "text" | "typing";
};

type GroceryItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  stock: number;
  emoji?: string;
};

// Removed local CartItem type to avoid conflict with imported type

const groceryItems: GroceryItem[] = [
  { id: "item1", category: "Fruits & Vegetables", name: "Granny Smith Apples (6-pack)", price: "R29.99", stock: 20, emoji: "🍎" },
  { id: "item2", category: "Fruits & Vegetables", name: "Baby Carrots (500g)", price: "R19.99", stock: 35, emoji: "🥕" },
  { id: "item3", category: "Fruits & Vegetables", name: "Baby Spinach (200g)", price: "R24.99", stock: 40, emoji: "🥬" },
  { id: "item4", category: "Fruits & Vegetables", name: "Strawberries (250g)", price: "R34.99", stock: 25, emoji: "🍓" },
  { id: "item5", category: "Fruits & Vegetables", name: "Avocados (2-pack)", price: "R22.99", stock: 15, emoji: "🥑" },
  { id: "item6", category: "Bakery, Eggs & Dairy", name: "Large Free Range Eggs (18-pack)", price: "R54.99", stock: 44, emoji: "🥚" },
  { id: "item7", category: "Bakery, Eggs & Dairy", name: "Whole Milk (2L)", price: "R32.99", stock: 60, emoji: "🥛" },
  { id: "item8", category: "Bakery, Eggs & Dairy", name: "Brown Bread (Sliced)", price: "R17.99", stock: 90, emoji: "🍞" },
  { id: "item9", category: "Bakery, Eggs & Dairy", name: "Cheddar Cheese (250g)", price: "R45.99", stock: 38, emoji: "🧀" },
  { id: "item10", category: "Bakery, Eggs & Dairy", name: "Plain Yoghurt (1kg)", price: "R36.99", stock: 26, emoji: "🥛" },
  { id: "item11", category: "Packaged Food", name: "Wholewheat Pasta (500g)", price: "R25.99", stock: 42, emoji: "🍝" },
  { id: "item12", category: "Packaged Food", name: "Basmati Rice (1kg)", price: "R42.99", stock: 34, emoji: "🍚" },
  { id: "item13", category: "Packaged Food", name: "Tomato Pasta Sauce (400g)", price: "R22.99", stock: 29, emoji: "🍅" },
  { id: "item14", category: "Packaged Food", name: "Granola Bars (Box of 6)", price: "R37.99", stock: 19, emoji: "🥜" },
  { id: "item15", category: "Packaged Food", name: "Peanut Butter (400g)", price: "R32.99", stock: 36, emoji: "🥜" },
  { id: "item16", category: "Packaged Food", name: "Cereal Flakes (750g)", price: "R49.99", stock: 39, emoji: "🥣" },
  { id: "item17", category: "Packaged Food", name: "Instant Coffee (200g)", price: "R59.99", stock: 23, emoji: "☕" },
  { id: "item18", category: "Packaged Food", name: "Coconut Cream (400ml)", price: "R26.99", stock: 27, emoji: "🥥" },
  { id: "item19", category: "Packaged Food", name: "Long Life Milk (6-pack)", price: "R72.99", stock: 45, emoji: "🥛" },
  { id: "item20", category: "Packaged Food", name: "Canned Chickpeas (410g)", price: "R17.99", stock: 21, emoji: "🫘" },
];

const TypingIndicator = () => (
  <div className="typing-indicator p-3">
    <div className="flex space-x-1 mr-3">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  <span className="text-xs text-gray-500">Falcorp AiButler is typing...</span>
  </div>
);

type AppProps = {
  cartItems: CartItem[];
  onAddToCart: (item: GroceryItem) => void;
};

function App({ cartItems, onAddToCart }: AppProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
  text: "Hi! 👋 Welcome to Falcorp AiButler Chat. I'm your personal shopping assistant! How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
      type: "text"
    },
  ]);
  const [input, setInput] = useState("");
  const [showGrocery, setShowGrocery] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const filteredItems = groceryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(groceryItems.map(item => item.category)))];


  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      type: "text"
    };
    
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let botText = "I'd be happy to help! You can ask me to 'show groceries' to browse our available items, or ask about specific products. 😊";
      
      if (input.toLowerCase().includes("grocery") || input.toLowerCase().includes("show") || input.toLowerCase().includes("browse")) {
        botText = "Perfect! Here are all our available grocery items. You can browse through our fresh selection! 🛍️";
        setShowGrocery(true);
      } else if (input.toLowerCase().includes("help")) {
        botText = "I can help you browse our grocery items! Try saying 'show groceries' or 'browse items' to see what we have available. 🛒";
      } else if (input.toLowerCase().includes("price")) {
        botText = "I can show you prices for all our items! Type 'show groceries' to see our full catalog with prices. 💰";
      }
      
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 1,
          sender: "bot",
          text: botText,
          timestamp: new Date().toLocaleTimeString(),
          type: "text"
        },
      ]);
    }, 1200);
  };

  const handlePaperClipClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle the file (e.g., upload, preview, etc.)
      alert(`Selected file: ${file.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient"></div>

      {/* Cart Icon - Top Right */}
      <Link
        to="/cart"
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 p-3 border border-white/40 group"
      >
        <div className="relative">
          <svg className="w-7 h-7 text-primary-600 group-hover:text-accent-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartItems.length > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
              {cartItems.length}
            </div>
          )}
        </div>
      </Link>

      <div className="relative z-10 w-full max-w-4xl mb-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl shadow-glow mb-4 animate-float">
            <span className="text-3xl">🛒</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold gradient-text text-shadow-lg mb-3">
            Falcorp AiButler
          </h1>
          <p className="text-lg text-gray-600 font-medium">Your AI-powered shopping companion</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Link
              to="/browse"
              className="px-4 py-2 bg-white/80 hover:bg-white text-primary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-white/40 hover:scale-105"
            >
              Browse Items
            </Link>
            <Link
              to="/help"
              className="px-4 py-2 bg-white/80 hover:bg-white text-primary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-white/40 hover:scale-105"
            >
              Get Help
            </Link>
            <Link
              to="/prices"
              className="px-4 py-2 bg-white/80 hover:bg-white text-primary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-white/40 hover:scale-105"
            >
              View Prices
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8 h-[700px] lg:h-[700px]">
        <div className="flex-1 glass-morphism rounded-3xl shadow-glass flex flex-col overflow-hidden border border-white/30">
          <header className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white py-5 px-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-accent-400/20 animate-shimmer shimmer-bg"></div>
            <div className="relative flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center shadow-inner-glow animate-bounce-gentle">
                <span className="text-xl lg:text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg lg:text-xl text-shadow">Falcorp AiButler</h3>
                <div className="flex items-center gap-2 text-sm text-primary-100">
                  <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">Online • Ready to help</span>
                </div>
              </div>
            </div>
            <button
              className="relative bg-white/20 hover:bg-white/30 px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105 shadow-lg"
              onClick={() => setShowGrocery((v) => !v)}
            >
              <span className="relative z-10">{showGrocery ? "Hide Items" : "Browse Items"}</span>
            </button>
          </header>

          <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto bg-gradient-to-b from-transparent to-gray-50/30 main-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} message-enter`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`chat-bubble max-w-xs lg:max-w-md px-5 py-3 sm:px-6 sm:py-4 transform transition-all duration-300 hover:scale-102 ${
                    msg.sender === "user"
                      ? "chat-bubble-user bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white shadow-glow rounded-3xl rounded-tr-[2.5rem]"
                      : "chat-bubble-bot bg-white/90 text-gray-800 shadow-glass border border-white/40 backdrop-blur-sm rounded-3xl rounded-tl-[2.5rem]"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center text-white shadow-inner-glow">
                        <span className="text-sm">🤖</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">Falcorp AiButler</span>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed font-medium">{msg.text}</div>
                  <div className={`text-xs mt-3 font-medium ${
                    msg.sender === "user" ? "text-primary-100" : "text-gray-500"
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="chat-bubble chat-bubble-bot bg-white/90 shadow-glass border border-white/40 backdrop-blur-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          <footer className="bg-white/80 backdrop-blur-xl px-6 py-5 border-t border-white/30">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  className="w-full border-2 border-gray-200/80 rounded-2xl pl-5 pr-12 py-4 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200/50 transition-all duration-300 text-base bg-gray-50/50 backdrop-blur-sm shadow-inner-glow placeholder-gray-400 hover:border-primary-300"
                  type="text"
                  placeholder="Ask me about groceries, prices, or anything else..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                {/* Hidden file input for attachments */}
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors cursor-pointer"
                  aria-label="Attach file"
                  tabIndex={0}
                  onClick={handlePaperClipClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.071-7.071a4 4 0 10-5.657-5.657l-8.486 8.486a6 6 0 108.486 8.486L19 13" />
                  </svg>
                </button>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <span className="text-sm">↵</span>
                </div>
              </div>
              <button
                className={`bg-gradient-to-r from-primary-500 to-accent-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-glow hover:shadow-glow-lg text-base relative overflow-hidden group ${
                  !input.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 animate-pulse-glow"
                }`}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Send</span>
              </button>
            </div>
          </footer>
        </div>

        {showGrocery && (
          <div className="w-full lg:w-[400px] glass-morphism rounded-3xl shadow-glass overflow-hidden border border-white/30 animate-slide-in lg:relative absolute inset-0 lg:inset-auto z-50 lg:z-auto">
            <div className="bg-gradient-to-r from-success-500 via-primary-500 to-accent-500 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-success-400/20 to-accent-400/20 animate-shimmer shimmer-bg"></div>
              <div className="relative flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-inner-glow">
                    <span className="text-xl">🛍️</span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-shadow">
                    Our Products
                  </h2>
                </div>
                <button
                  className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg border border-white/30"
                  onClick={() => setShowGrocery(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="relative text-sm text-white/90 font-medium">Fresh • Quality • Affordable</p>

              <div className="relative mt-4 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm text-sm"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-6 h-[580px] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50">🔍</div>
                    <p className="text-gray-500 font-medium">No products found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  Object.entries(
                    filteredItems.reduce((acc, item) => {
                      if (!acc[item.category]) acc[item.category] = [];
                      acc[item.category].push(item);
                      return acc;
                    }, {} as Record<string, GroceryItem[]>)
                  ).map(([category, items]) => (
                    <div key={category} className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="font-display font-bold text-gray-700 text-base">
                          {category}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                          {items.length} items
                        </span>
                      </div>
                      <div className="grid gap-3">
                        {items.map((item, index) => (
                          <div
                            key={item.id}
                            className="floating-card bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-glass animate-scale-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl shadow-inner-glow">
                                {item.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-1 truncate">
                                  {item.name}
                                </h4>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-lg font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">
                                    {item.price}
                                  </span>
                                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                                    item.stock > 30
                                      ? "bg-success-50 text-success-700 border-success-200"
                                      : item.stock > 10
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                                  }`}>
                                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                                      item.stock > 30 ? "bg-success-400" : item.stock > 10 ? "bg-yellow-400" : "bg-red-400"
                                    }`}></span>
                                    {item.stock} in stock
                                  </span>
                                </div>
                                <button
                                  onClick={() => onAddToCart(item)}
                                  className="mt-2 w-full bg-gradient-to-r from-primary-500 to-accent-600 text-white py-2 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
