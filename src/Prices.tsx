import { useEffect, useState } from "react";
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

function Prices({ cartItemCount }: PricesProps) {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<"unknown" | "ok" | "fail">("unknown");
  const [healthMsg, setHealthMsg] = useState<string | null>(null);

  // 🔹 Fetch from DynamoDB Lambda endpoint
  // Extracted fetch function so it can be called on refresh
  const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://67dyc7e4dbuqi72ioprqq4bxaa0uslwu.lambda-url.us-east-1.on.aws/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const data = await res.json();
        console.log("[Prices] data:", data);

        // ✅ Get results from Lambda response
        const results = data?.results || [];

        if (results.length > 0) {
          const mapped = results.map((item: any) => ({
            id: item.id || String(item.name || crypto.randomUUID()),
            category: item.category || "Uncategorized",
            name: item.name || "Unnamed Item",
            price: item.price?.toString() || "R0.00",
            stock: Number(item.stock) || 0,
            emoji: item.emoji || "🛒",
          }));
          setGroceryItems(mapped);
        } else {
          setError("No products returned by the API.");
        }
      } catch (err) {
        console.error("Error fetching price data:", err);
        setError("Failed to load product prices.");
      } finally {
        setLoading(false);
      }
  };

  // health check function
  const checkHealth = async () => {
    try {
      const r = await fetch(
        "https://67dyc7e4dbuqi72ioprqq4bxaa0uslwu.lambda-url.us-east-1.on.aws/",
        { method: "GET" }
      );
      if (r.ok) {
        setHealth("ok");
        setHealthMsg("DynamoDB API reachable");
      } else {
        setHealth("fail");
        setHealthMsg(`API returned ${r.status}`);
      }
    } catch (err: any) {
      console.warn("Health check failed:", err);
      setHealth("fail");
      setHealthMsg(String(err?.message ?? err));
    }
  };

  useEffect(() => {
    // initial load + health
    fetchPrices();
    checkHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Filter & Sort
  const filteredItems = groceryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-low")
      return parseFloat(a.price.replace("R", "")) -
             parseFloat(b.price.replace("R", ""));
    return parseFloat(b.price.replace("R", "")) -
           parseFloat(a.price.replace("R", ""));
  });

  const categories = ["All", ...Array.from(new Set(groceryItems.map((i) => i.category)))];

  const getCategoryStats = (category: string) => {
    const items =
      category === "All"
        ? groceryItems
        : groceryItems.filter((item) => item.category === category);
    if (!items.length) return { avg: "0.00", min: "0.00", max: "0.00", count: 0 };
    const prices = items.map((item) => parseFloat(item.price.replace("R", "")));
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    return {
      avg: avg.toFixed(2),
      min: Math.min(...prices).toFixed(2),
      max: Math.max(...prices).toFixed(2),
      count: items.length,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient"></div>

      {/* Cart Icon (match main page placement) */}
      <Link
        to="/cart"
        className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 p-3 border border-white/40 group"
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

      <div className="relative z-10 max-w-7xl mx-auto mt-4 sm:mt-8 px-2 sm:px-0">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl shadow-glow">
            <span className="text-3xl">💰</span>
          </div>
        </div>

        {/* 🔹 Price Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {categories.slice(0, 4).map((cat) => {
            const stats = getCategoryStats(cat);
            return (
              <div key={cat} className="glass-morphism rounded-2xl shadow-glass border border-white/30 p-5 animate-scale-in">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">
                  {cat === "All" ? "All Products" : cat}
                </h3>
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

        {/* 🔹 Loading / Error / Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg animate-pulse">
            Loading product prices...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 text-lg">{error}</div>
        ) : (
          <div className="glass-morphism rounded-3xl shadow-glass border border-white/30 overflow-hidden">
            <div className="bg-gradient-to-r from-success-600 via-primary-500 to-accent-500 text-white p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-success-400/20 to-accent-400/20 animate-shimmer shimmer-bg"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="relative text-2xl sm:text-3xl font-display font-bold text-shadow mb-2">Price List</h1>
                    <p className="relative text-white/90 font-medium text-sm sm:text-base">Compare prices and find the best deals</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Health indicator */}
                    <div
                      title={healthMsg ?? "Status"}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                        health === "ok"
                          ? "bg-white/20 text-white"
                          : health === "fail"
                          ? "bg-red-500/80 text-white"
                          : "bg-yellow-400/80 text-white"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${health === "ok" ? "bg-green-400" : health === "fail" ? "bg-red-300" : "bg-yellow-200"}`}></span>
                      <span>{health === "ok" ? "OK" : health === "fail" ? "Down" : "Checking"}</span>
                    </div>

                    {/* Refresh button */}
                    <button
                      onClick={async () => {
                        setLoading(true);
                        setError(null);
                        await fetchPrices();
                        await checkHealth();
                      }}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-white/30"
                      title="Refresh prices"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 1112.728-12.728L20 8" />
                      </svg>
                    </button>
                  </div>
                </div>

              {/* 🔹 Search and Filters */}
              <div className="relative mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                  {categories.map((category) => (
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

            <div className="p-3 sm:p-6 space-y-2 sm:space-y-3">
              {sortedItems.map((item, i) => (
                <div
                  key={item.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-4 shadow-glass hover:shadow-lg transition-all duration-200 animate-scale-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Mobile layout: vertical stacking */}
                  <div className="flex sm:hidden gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl shadow-inner-glow flex-shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-base mb-1 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{item.category}</p>

                      {/* Price and stock in a row on mobile */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xl font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">
                          {item.price}
                        </div>
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium border ${
                          item.stock > 30
                            ? "bg-success-50 text-success-700 border-success-200"
                            : item.stock > 10
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            item.stock > 30
                              ? "bg-success-400"
                              : item.stock > 10
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`} />
                          {item.stock > 30 ? "In Stock" : item.stock > 10 ? "Low" : "Limited"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout: horizontal */}
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl shadow-inner-glow flex-shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-base mb-1 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prices;
