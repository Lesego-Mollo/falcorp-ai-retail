import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      alert("❌ Invalid credentials or account doesn’t exist.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("userId", user.email); // or use user.id if you have one
    alert(`✅ Welcome back, ${user.name || user.email}!`);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary-600 mb-6">
          Login to Falcorp AiButler
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary-500 font-semibold">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
