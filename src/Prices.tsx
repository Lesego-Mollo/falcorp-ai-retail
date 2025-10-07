import { useState } from "react";
import { Link } from "react-router-dom";

type GroceryItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  stock: number;
  emoji?: string;
};

type PricesProps = {
  cartItemCount: number;
};

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

function Prices({ cartItemCount }: PricesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">("name");

  const filteredItems = groceryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "price-low") {
      return parseFloat(a.price.replace("R", "")) - parseFloat(b.price.replace("R", ""));
    } else {
      return parseFloat(b.price.replace("R", "")) - parseFloat(a.price.replace("R", ""));
    }
  });

  const categories = ["All", ...Array.from(new Set(groceryItems.map(item => item.category)))];

  const getCategoryStats = (category: string) => {
    const items = category === "All" ? groceryItems : groceryItems.filter(item => item.category === category);
    const prices = items.map(item => parseFloat(item.price.replace("R", "")));
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { avg: avg.toFixed(2), min: min.toFixed(2), max: max.toFixed(2), count: items.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 font-sans">
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
          {cartItemCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
              {cartItemCount}
            </div>
          )}
        </div>
      </Link>

      <div className="relative z-10 max-w-7xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </Link>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl shadow-glow">
            <span className="text-3xl">💰</span>
          </div>
        </div>

        {/* Price Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {["All", "Fruits & Vegetables", "Bakery, Eggs & Dairy", "Packaged Food"].map((cat) => {
            const stats = getCategoryStats(cat);
            return (
              <div key={cat} className="glass-morphism rounded-2xl shadow-glass border border-white/30 p-5 animate-scale-in">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">{cat === "All" ? "All Products" : cat}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average:</span>
                    <span className="font-bold text-primary-600">R{stats.avg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lowest:</span>
                    <span className="font-bold text-success-600">R{stats.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highest:</span>
                    <span className="font-bold text-accent-600">R{stats.max}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-bold text-gray-800">{stats.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-morphism rounded-3xl shadow-glass border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-success-600 via-primary-500 to-accent-500 text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-success-400/20 to-accent-400/20 animate-shimmer shimmer-bg"></div>
            <h1 className="relative text-3xl font-display font-bold text-shadow mb-2">Price List</h1>
            <p className="relative text-white/90 font-medium">Compare prices and find the best deals</p>

            <div className="relative mt-6 grid md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800 text-white">
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "price-low" | "price-high")}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              >
                <option value="name" className="bg-gray-800 text-white">Sort by Name</option>
                <option value="price-low" className="bg-gray-800 text-white">Price: Low to High</option>
                <option value="price-high" className="bg-gray-800 text-white">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            {sortedItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 opacity-50">🔍</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">No products found</h2>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-4 shadow-glass hover:shadow-lg transition-all duration-200 animate-scale-in flex items-center gap-4"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl shadow-inner-glow flex-shrink-0">
                      {item.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-base mb-1 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                        item.stock > 30
                          ? "bg-success-50 text-success-700 border-success-200"
                          : item.stock > 10
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {item.stock > 30 ? "In Stock" : item.stock > 10 ? "Low Stock" : "Limited"}
                      </span>

                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">
                          {item.price}
                        </div>
                      </div>

                      <Link
                        to="/browse"
                        className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prices;
