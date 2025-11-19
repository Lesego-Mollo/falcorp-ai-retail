// SignupPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      alert("⚠️ Account already exists with that email.");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert(`✅ Welcome, ${name}! You can now log in.`);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary-600 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-primary-500 font-semibold">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
