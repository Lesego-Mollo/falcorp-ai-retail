// App.tsx
import { useState, useRef, useEffect } from "react";
import type { CartItem } from "./Cart";
import { Link } from "react-router-dom";
import type { GroceryItem } from "./types";


// 🌐 Reminder API Endpoints
const REMINDER_API =
  "https://09mezv8u5h.execute-api.us-east-1.amazonaws.com/prod/reminders";

// ✅ Fetch due reminders (normalized to { reminders: [...] })
async function fetchReminders(userId: string): Promise<{ reminders: any[] }> {
  try {
    const res = await fetch(
      `${REMINDER_API}/check?userId=${encodeURIComponent(userId)}`
    );
    if (!res.ok) throw new Error("Failed to fetch reminders");
    const json = await res.json();

    // Normalize various shapes → { reminders: [...] }
    if (Array.isArray(json)) return { reminders: json };
    if (json && Array.isArray(json.reminders))
      return { reminders: json.reminders };
    if (json && Array.isArray(json.items)) return { reminders: json.items };
    return { reminders: [] };
  } catch (err) {
    console.error("⚠️ Reminder fetch failed:", err);
    return { reminders: [] };
  }
}

// ✅ Confirm restock
async function confirmRestock(userId: string, item: string) {
  try {
    const res = await fetch(`${REMINDER_API}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, item }),
    });
    return await res.json();
  } catch (err) {
    console.error("⚠️ Restock confirmation failed:", err);
    return { message: "❌ Unable to confirm restock." };
  }
}

/* === Reminder item extractor === */
function extractItemFromReminder(text: string) {
  const patterns = [
    /since your last\s+(.+?)\s+purchase/i,
    /buy\s+(.+?)\s+every/i,
    /Reminder:\s*(?:You usually buy\s*)?(.+?)\s*(?:every|$)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      return m[1].trim().replace(/[.,;:!?…—-]+$/, ""); // strip trailing punctuation
    }
  }
  return null;
}
/* === END === */

// 🧹 Removes XML-like tags (<query>, <action>, etc.) before rendering
function sanitizeMessage(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]+>/g, "").trim();
}

// ---- Helpers to make bot responses more conversational ----
function choose<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function botTextForItems(count: number, userQuery: string) {
  const cleanQuery = (userQuery || "").trim().toLowerCase();

  // More conversational responses that reference what they asked for
  const responses = [
    // Friendly and casual
    `Perfect! I've got ${count} ${count === 1 ? "option" : "options"} for you${cleanQuery ? ` for "${cleanQuery}"` : ""}. Check them out! 🛒`,

    // Helpful assistant vibe
    `Great choice! I found ${count} ${count === 1 ? "item" : "items"}${cleanQuery ? ` matching "${cleanQuery}"` : ""}. Take a look and let me know if you need anything else! ✨`,

    // Personal shopper feel
    `Awesome! I've pulled ${count} ${count === 1 ? "product" : "products"} for you${cleanQuery ? ` — all about ${cleanQuery}` : ""}. Want to add any to your cart? 🛍️`,

    // Enthusiastic helper
    `Nice! Found ${count} ${count === 1 ? "match" : "matches"}${cleanQuery ? ` for ${cleanQuery}` : ""}. Have a look — I think you'll like what I found! 😊`,

    // Conversational and warm
    `${count === 1 ? "Here's what I found" : `Got ${count} good options here`}${cleanQuery ? ` for your ${cleanQuery} search` : ""}! Let me know if you'd like me to suggest something else. 🌟`,

    // Casual and friendly
    `Alright! ${count} ${count === 1 ? "item" : "items"} coming right up${cleanQuery ? ` — all ${cleanQuery} related` : ""}. Take your pick! 🎯`,

    // Helpful recommendation style
    `I think you'll like these! Found ${count} ${count === 1 ? "option" : "options"}${cleanQuery ? ` for "${cleanQuery}"` : ""} that should work perfectly. 👌`,

    // Natural conversation
    `${count === 1 ? "Here you go! One item" : `Sweet! ${count} items`} that ${count === 1 ? "matches" : "match"} what you're looking for${cleanQuery ? ` (${cleanQuery})` : ""}. Check them out below! 🛒`,
  ];

  return choose(responses);
}

function botWrapOutput(rawText: string) {
  const trimmed = (rawText || "").trim();
  if (!trimmed) return "Hmm, I didn't quite catch that. Could you try asking in a different way? 🤔";

  // More varied and conversational intros
  const starters = [
    "Got it!",
    "Sure thing!",
    "Alright!",
    "Absolutely!",
    "Of course!",
    "No problem!",
    "Happy to help!",
    "Here's what I think:",
    "Let me help with that —",
  ];

  return `${choose(starters)} ${trimmed}`;
}
// ---- end conversational helpers ----


// ---------- Small helpers for cart item creation ----------
function toTitleCase(s: string) {
  return s
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function guessEmoji(name: string,category?: string) {
  const n = name.toLowerCase();
  const c = (category || "").toLowerCase();
 /* if (n.includes("bread")) return "🍞";
  if (n.includes("milk")) return "🥛";
  if (n.includes("egg")) return "🥚";
  if (n.includes("apple")) return "🍎";
  if (n.includes("banana")) return "🍌";
  if (n.includes("cheese")) return "🧀";
  if (n.includes("meat")) return "🥩";
  if (n.includes("coffee")) return "☕";
  if (n.includes("rice")) return "🍚"; */

    // 🍫 Pantry & Snacks — keep these FIRST
  if (n.includes("chocolate")) return "🍫";
  if (n.includes("cookie") || n.includes("biscuit")) return "🍪";
  if (n.includes("chips")) return "🍟";
  if (n.includes("cake") || n.includes("muffin")) return "🧁";
  if (n.includes("candy") || n.includes("sweet")) return "🍬";
  if (n.includes("popcorn")) return "🍿";
  if (n.includes("nuts") || n.includes("almond") || n.includes("peanut")) return "🥜";

  // 🥤 Drinks & Beverages
  if (n.includes("cola") || n.includes("soft drink") || n.includes("soda")) return "🥤";
  if (n.includes("juice")) return "🧃";
  if (n.includes("coffee")) return "☕";
  if (n.includes("tea")) return "🍵";
  if (n.includes("water")) return "💧";
  if (n.includes("yogurt")) return "🥛";

  // 🍎 Fruits
  if (n.includes("apple")) return "🍎";
  if (n.includes("banana")) return "🍌";
  if (n.includes("orange")) return "🍊";
  if (n.includes("grape")) return "🍇";
  if (n.includes("strawberry")) return "🍓";
  if (n.includes("melon")) return "🍈";

  // 🥦 Vegetables
  if (n.includes("tomato")) return "🍅";
  if (n.includes("carrot")) return "🥕";
  if (n.includes("potato")) return "🥔";
  if (n.includes("onion")) return "🧅";
  if (n.includes("lettuce") || n.includes("spinach")) return "🥬";

  // 🥛 Dairy & Bakery
  if (n.includes("milk")) return "🥛";
  if (n.includes("cheese")) return "🧀";
  if (n.includes("butter")) return "🧈";
  if (n.includes("bread")) return "🍞";
  if (n.includes("egg")) return "🥚";

  // 🥩 Meat & Seafood
  if (n.includes("meat") || n.includes("beef")) return "🥩";
  if (n.includes("chicken")) return "🍗";
  if (n.includes("fish")) return "🐟";
  if (n.includes("shrimp")) return "🦐";

  // 🧽 Household / Misc
  if (n.includes("soap") || n.includes("detergent")) return "🧼";
  if (n.includes("cleaner")) return "🧽";
  if (n.includes("toothpaste")) return "🪥";
  if (n.includes("shampoo")) return "🧴";

  // 🌿 Category fallback
  if (c.includes("snack")) return "🍫";
  if (c.includes("drink") || c.includes("beverage")) return "🥤";
  if (c.includes("fruit")) return "🍎";
  if (c.includes("vegetable")) return "🥦";
  if (c.includes("dairy")) return "🥛";
  if (c.includes("meat")) return "🥩";
  if (c.includes("cleaning")) return "🧽";
  if (c.includes("bakery")) return "🥐";

  return "🛒";
}
// ---- Name refinement ----
function looksGenericName(s: string) {
  const t = (s || "").trim().toLowerCase();
  if (!t) return true;
  return (
    t.includes("category") ||
    t === "dairy" ||
    t === "groceries" ||
    t === "grocery" ||
    t === "items" ||
    t.length < 4
  );
}

// ---- NEW: name refinement to avoid generic labels ----
/*function looksGenericName(s: string) {
  const t = (s || "").trim().toLowerCase();
  if (!t) return true;
  return (
    t.includes("category") ||
    t === "dairy" ||
    t === "groceries" ||
    t === "grocery" ||
    t === "items" ||
    t.length < 4
  );
} */
function refineName(parsedName: string, userQuery: string) {
  if (!looksGenericName(parsedName)) return parsedName;
  const cleaned = userQuery
    .replace(/^(add|buy|i want|please|let(?:'|)s add|find)\b/gi, "")
    .replace(/[^\w\s\-()]/g, "")
    .trim();
  return cleaned ? toTitleCase(cleaned) : parsedName;
}

// ---- Price normalization/validation + stable IDs ----
function normalizePrice(p: any): string {
  // keep digits and dot only, e.g. "R 32,99" -> "32.99"
  const cleaned = String(p ?? "")
    .replace(/[,]/g, ".")
    .replace(/[^\d.]/g, "");
  return cleaned;
}
function formatRand(p: string): string {
  const n = Number(p || 0);
  return `R${n.toFixed(2)}`;
}
function isValidPriceR(price: string): boolean {
  return /^R\d+(\.\d{2})?$/.test(price.trim());
}
function stableId(name: string, priceR: string): string {
  const n = name.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 60);
  const p = normalizePrice(priceR);
  return `${n}__${p}`; // e.g. "peanut-butter-400g__32.99"
}

// ------------------ Types ------------------
type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  type?: "text" | "typing";
  items?: GroceryItem[]; // Items associated with this message
};

/*type GroceryItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  stock?: number;
  emoji?: string;
};*/

// ------------------ Components ------------------
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

// ------------------ Main Component ------------------
function App({ cartItems, onAddToCart }: AppProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text:
        "Hey there! 👋 I'm your Falcorp AiButler, here to make grocery shopping easier. Need help finding something? Want to compare prices? Or maybe plan a meal? Just let me know what you're looking for!",
      timestamp: new Date().toLocaleTimeString(),
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [showGrocery, setShowGrocery] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<"chat" | "items">("chat"); // Toggle between chat and items on mobile
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🧠 Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.email); // or user.id if available
    }
  }, []);

  // 🧠 Fetch reminders for logged-in user (defensive against API shape)
  useEffect(() => {
    if (!userId) return;

    async function loadReminders(uid: string) {
      const { reminders } = await fetchReminders(uid);
      if (!Array.isArray(reminders) || reminders.length === 0) return;

      const reminderMessages = reminders.map((r: any, idx: number) => {
        const msgText =
          typeof r === "string"
            ? r
            : r?.message ?? r?.text ?? r?.reminder ?? JSON.stringify(r);
        return {
          id: Date.now() + idx + Math.random(),
          sender: "bot",
          text: `🧠 Reminder: ${msgText}`,
          timestamp: new Date().toLocaleTimeString(),
          type: "text",
        } as Message;
      });

      setMessages((msgs) => [...msgs, ...reminderMessages]);
    }

    loadReminders(userId); // userId is guaranteed non-null here
  }, [userId]);

  // ------------------ Extract Keywords from Natural Language ------------------
  const extractSearchKeywords = (query: string): string => {
    let cleaned = query.toLowerCase().trim();

    // Remove common phrases people use when asking for items
    const removePatterns = [
      /^(i want|i need|give me|show me|get me|find|search for|looking for|can i (get|have))/i,
      /\b(some|any|a|an|the)\b/gi,
      /\b(please|thanks|thank you)\b/gi,
    ];

    removePatterns.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, " ");
    });

    // Clean up extra spaces and trim
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned || query.toLowerCase().trim();
  };

  // ------------------ DynamoDB Product Search ------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      type: "text",
    };

    setMessages((msgs) => [...msgs, userMsg]);
    const searchQuery = extractSearchKeywords(input); // Extract actual keywords
    setInput("");
    setIsTyping(true);

    try {
      // 🔍 Search DynamoDB directly for products
      const res = await fetch(
        "https://67dyc7e4dbuqi72ioprqq4bxaa0uslwu.lambda-url.us-east-1.on.aws/",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error(`DynamoDB API returned ${res.status}`);
      }

      const data = await res.json();
      console.log("DynamoDB data:", data);
      console.log("Search query (extracted):", searchQuery);

      const allItems = data?.results || [];

      // 🔎 Filter items based on user's search query
      const results = allItems.filter((item: any) => {
        const name = (item.name || "").toLowerCase();
        const category = (item.category || "").toLowerCase();

        // Try exact phrase match first
        if (name.includes(searchQuery) || category.includes(searchQuery)) {
          return true;
        }

        // If no exact match, try matching individual words
        const keywords = searchQuery.split(" ").filter((w) => w.length > 2);
        return keywords.some((keyword) =>
          name.includes(keyword) || category.includes(keyword)
        );
      });

      let botMessages: Message[] = [];
      if (Array.isArray(results) && results.length > 0) {
        // 🔒 Normalize, validate, refine names, and generate stable IDs
        const mappedItems = results
          .map((raw: any) => {
            const originalName = (raw?.name ?? "").toString().trim();
            const name = refineName(originalName, userMsg.text); // ← key fix
            const category =
              (raw?.category ?? "Groceries").toString().trim() || "Groceries";

            const cleaned = normalizePrice(raw?.price);
            const priceR = formatRand(cleaned);

            // Require a name and a valid price
            if (!name || !isValidPriceR(priceR)) return null;

            return {
              id: stableId(name, priceR),
              name,
              category,
              price: priceR,
              stock: Number(raw?.stock) || 0,
              emoji: raw?.emoji || guessEmoji(name),
            } as GroceryItem;
          })
          .filter(Boolean) as GroceryItem[];

        const messageId = Date.now();
        botMessages = [
          {
            id: messageId,
            sender: "bot",
            text: botTextForItems(mappedItems.length, userMsg.text),
            timestamp: new Date().toLocaleTimeString(),
            type: "text",
            items: mappedItems, // Store items with message
          },
        ];

        // Show panel and select this message's items
        setSelectedMessageId(messageId);
        setShowGrocery(true);
        setMobileView("items"); // Auto-switch to items view on mobile
      } else {
        // No results found - show friendly message
        const noResultsMessages = [
          `Hmm, I couldn't find anything matching "${searchQuery}". Try searching for something else like "bread", "milk", or "snacks"! 🔍`,
          `No luck finding "${searchQuery}" right now. Maybe try a different search term? I've got tons of groceries! 🛒`,
          `Oops! Nothing came up for "${searchQuery}". Want to try searching for something else? 😊`,
          `I don't see any "${searchQuery}" in stock at the moment. Try browsing for other items or ask me for something specific! 🌟`,
        ];

        botMessages = [
          {
            id: Date.now(),
            sender: "bot",
            text: choose(noResultsMessages),
            timestamp: new Date().toLocaleTimeString(),
            type: "text",
          },
        ];
      }

      // Vary the typing animation delay slightly to feel more natural
      const delay = 400 + Math.floor(Math.random() * 700);
      setTimeout(() => {
        setMessages((msgs) => [...msgs, ...botMessages]);
        setIsTyping(false);
      }, delay);
    } catch (err) {
      console.error("❌ Error searching products:", err);
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now(),
          sender: "bot",
          text: "Oops! I'm having trouble searching for products right now. Please try again in a moment! 😅",
          timestamp: new Date().toLocaleTimeString(),
          type: "text",
        },
      ]);
      setIsTyping(false);
    }
  };

  // ------------------ File Input ------------------
  const handlePaperClipClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) alert(`Selected file: ${file.name}`);
  };

  // ------------------ Get Items from Selected Message ------------------
  const currentItems: GroceryItem[] = selectedMessageId
    ? messages.find((m) => m.id === selectedMessageId)?.items || []
    : [];

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient"></div>

      {/* 🛒 Cart Icon */}
      <Link
        to="/cart"
        className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 p-3 border border-white/40 group"
      >
        <div className="relative">
          <svg
            className="w-7 h-7 text-primary-600 group-hover:text-accent-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartItems.length > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
              {cartItems.length}
            </div>
          )}
        </div>
      </Link>

      {/* 🌟 Header */}
      <div className="relative z-10 w-full max-w-4xl mb-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl shadow-glow mb-4 animate-float">
          <span className="text-3xl">🛒</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-display font-bold gradient-text text-shadow-lg mb-3">
          Falcorp AiButler
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Your AI-powered shopping companion
        </p>
        {/* Top header action buttons (keeps top nav intact) */}
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

      {/* 📱 Mobile Toggle Buttons (only show on small screens when items panel is visible) */}
      {showGrocery && (
        <div className="relative z-10 w-full max-w-7xl mb-4 lg:hidden">
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-glass border border-white/40">
            <button
              onClick={() => setMobileView("chat")}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                mobileView === "chat"
                  ? "bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/60"
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setMobileView("items")}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                mobileView === "items"
                  ? "bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/60"
              }`}
            >
              🛒 Items ({currentItems.length})
            </button>
          </div>
        </div>
      )}

      {/* 💬 Chat + Products */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8 h-[700px]">
        {/* Chat Section - Hide on mobile when items view is active */}
        <div className={`flex-1 glass-morphism rounded-3xl shadow-glass flex flex-col overflow-hidden border border-white/30 ${
          mobileView === "items" && showGrocery ? "hidden lg:flex" : "flex"
        }`}>
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

          {/* Chat Window */}
          <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto bg-gradient-to-b from-transparent to-gray-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`chat-bubble max-w-xs lg:max-w-md px-5 py-3 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white rounded-3xl rounded-tr-[2.5rem]"
                      : "bg-white/90 text-gray-800 shadow-glass border border-white/40 rounded-3xl rounded-tl-[2.5rem]"
                  }`}
                >
                  <div className="text-sm">{sanitizeMessage(msg.text)}</div>

                  {/* 🛍️ Shop Items button for messages with products */}
                  {msg.sender === "bot" && msg.items && msg.items.length > 0 && (
                    <button
                      className="mt-3 bg-gradient-to-r from-primary-500 to-accent-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition shadow-md cursor-pointer"
                      onClick={() => {
                        setSelectedMessageId(msg.id);
                        setShowGrocery(true);
                      }}
                    >
                      🛍️ Shop Items ({msg.items.length})
                    </button>
                  )}

                  {/* 💡 Restock button for reminder messages */}
                  {msg.text.includes("🧠 Reminder:") && (
                    <button
                      className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
                      onClick={async (e) => {
                        const btn = e.currentTarget;
                        btn.textContent = "⏳ Processing...";
                        btn.disabled = true;

                        const rawItem = extractItemFromReminder(msg.text) ?? "";
                        const uid = (userId ?? "guest").trim().toLowerCase();

                        // --- Guard if item not detected ---
                        if (!rawItem) {
                          setMessages((msgs) => [
                            ...msgs,
                            {
                              id: Date.now(),
                              sender: "bot",
                              text:
                                "I couldn’t detect which product to restock. Please try again from a reminder message.",
                              timestamp: new Date().toLocaleTimeString(),
                              type: "text",
                            },
                          ]);
                          btn.textContent = "Restock Now";
                          btn.disabled = false;
                          return;
                        }

                        const itemKey = rawItem.toLowerCase();
                        const result = await confirmRestock(uid, itemKey);

                        // ✅ Add to cart immediately after confirm
                        const cartItem: GroceryItem = {
                          id: `restock-${Date.now()}`,
                          name: toTitleCase(rawItem),
                          category: "Restock",
                          price: "R0.00", // plug in catalog price if available
                          stock: 1,
                          emoji: guessEmoji(rawItem),
                        };
                        onAddToCart(cartItem);

                        btn.textContent = "Restock Now";
                        btn.disabled = false;

                        setMessages((msgs) => [
                          ...msgs,
                          {
                            id: Date.now(),
                            sender: "bot",
                            text:
                              result?.message ||
                              `✅ ${cartItem.name} added to cart and restock confirmed!`,
                            timestamp: new Date().toLocaleTimeString(),
                            type: "text",
                          },
                        ]);
                      }}
                    >
                      Restock Now
                    </button>
                  )}

                  <div
                    className={`text-xs mt-2 ${
                      msg.sender === "user" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="chat-bubble chat-bubble-bot bg-white/90 border border-white/40">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </main>

          {/* Chat Footer */}
          <footer className="bg-white/80 backdrop-blur-xl px-6 py-5 border-t border-white/30">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  className="w-full border-2 border-gray-200 rounded-2xl pl-5 pr-12 py-4 focus:outline-none focus:border-primary-400 transition-all"
                  type="text"
                  placeholder="Ask me about groceries, prices, or anything else..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={handlePaperClipClick}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  📎
                </button>
              </div>
              <button
                className={`bg-gradient-to-r from-primary-500 to-accent-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-glow ${
                  !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>
          </footer>
        </div>

        {/* Grocery Panel - Hide on mobile when chat view is active */}
        {showGrocery && (
          <div className={`w-full lg:w-[400px] glass-morphism rounded-3xl shadow-glass overflow-hidden border border-white/30 ${
            mobileView === "chat" ? "hidden lg:block" : "block"
          }`}>
            <div className="bg-gradient-to-r from-success-500 via-primary-500 to-accent-500 text-white p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">AI Recommended Items</h2>
              <button
                onClick={() => {
                  setShowGrocery(false);
                  setMobileView("chat"); // Switch back to chat view on mobile
                }}
                className="cursor-pointer hover:scale-125 hover:rotate-90 transition-all duration-300 text-xl font-bold"
              >
                ✖
              </button>
            </div>

            <div className="p-6 h-[580px] overflow-y-auto">
              {currentItems.length === 0 ? (
                <p className="text-center text-gray-500 mt-12">
                  No products yet — ask me something like "show me dairy under 50
                  rand" 🧀
                </p>
              ) : (
                currentItems.map((item, i) => (
                  <div
                    key={item.id || i}
                    className="bg-white rounded-xl p-4 shadow-md mb-4 flex items-center gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    {/* Make emoji solid and non-shrinking */}
                    <div className="text-2xl leading-none select-none shrink-0">
                      {item.emoji || "🛍️"}
                    </div>

                    {/* Allow text to wrap properly */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 whitespace-normal break-words">
                        {item.name}
                      </h4>
                      <div className="text-primary-600 font-bold">{item.price}</div>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </div>

                    <button
                      onClick={() => onAddToCart(item)}
                      disabled={!item.price || !isValidPriceR(item.price)}
                      title={
                        !item.price || !isValidPriceR(item.price)
                          ? "Price missing/invalid"
                          : "Add to cart"
                      }
                      className={`bg-gradient-to-r from-primary-500 to-accent-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-transform ${
                        !item.price || !isValidPriceR(item.price)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:scale-105"
                      }`}
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;