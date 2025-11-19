import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TopBar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-white/80 backdrop-blur-md shadow px-8 py-4 border-b border-gray-200">
      <Link to="/" className="text-xl font-bold text-primary-700">
        🛒 Falcorp AiButler
      </Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-gray-600 text-sm">
              👋 Hi, {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-800 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-800 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-primary-600 hover:text-primary-800 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
