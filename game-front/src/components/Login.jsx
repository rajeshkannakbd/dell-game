import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://dell-game-lingesh-server.onrender.com";


export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.endsWith("@dell.com")) {
      setError("Access denied. Please login using your @dell.com email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      const user = await res.json();

      // Optional: store user info
      localStorage.setItem("user", JSON.stringify(user));

      // Admin check
      if (user.email === "ravidelladmin@dell.com") {
        navigate("/admin");
      } else {
        navigate("/game");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-slate-950 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-sky-400 text-center mb-2">
          🎮 Game Login
        </h1>
        <p className="text-slate-400 text-center mb-6">
          Login with your Dell account to continue
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="block text-slate-300 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@dell.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-sky-400 text-slate-900 font-semibold hover:bg-sky-500 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-slate-500 text-center mt-6">
          Only <span className="text-sky-400">@dell.com</span> email accounts are allowed.
        </p>
      </div>
    </div>
  );
}
