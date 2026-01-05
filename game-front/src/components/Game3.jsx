import { useState } from "react";

const API = "http://localhost:5000"; // backend URL

export default function Game3() {
  const [points, setPoints] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!points || !screenshot) {
      alert("Please enter points and upload screenshot!");
      return;
    }

    // ✅ FIX: get logged-in user properly
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.email) {
      alert("User not logged in. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("points", points);
      formData.append("email", user.email); // ✅ correct
      formData.append("game", "game3");
      formData.append("screenshot", screenshot);

      const res = await fetch(`${API}/api/submit-score`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Score submitted successfully ✅");
        setPoints("");
        setScreenshot(null);
      } else {
        alert(data.message || "Submission failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4 py-8">

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-sky-400 text-center mb-8">
        🎮 Ping Pong
      </h1>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto justify-center">

        {/* Game Section */}
        <div className="bg-slate-950 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
          <iframe
            src="https://scratch.mit.edu/projects/1261455988/embed"
            allowTransparency="true"
            width="485"
            height="402"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title="Ping Pong Game"
            className="rounded-xl border-2 border-sky-400"
          />

          {/* Score + Upload */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="number"
              placeholder="Enter your points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="px-4 py-2 w-44 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />

            <label className="cursor-pointer px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">
              📸 Upload Screenshot
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setScreenshot(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-sky-400 text-slate-900 font-semibold hover:bg-sky-500 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send 🚀"}
            </button>
          </div>

          {screenshot && (
            <p className="text-sm text-green-400 mt-2">
              ✔ Screenshot selected
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-slate-900 rounded-2xl shadow-xl p-6 w-full max-w-sm text-slate-200">
          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            📜 Instructions
          </h2>

          <ul className="space-y-3 text-base">
            <li>▶ Click the <span className="text-green-400 font-semibold">green flag</span> to start.</li>
            <li>▶ Use your <span className="font-semibold">mouse / cursor</span> to move the paddle.</li>
            <li>▶ Keep the ball bouncing.</li>
            <li>
              ▶ Ball touching{" "}
              <span className="text-red-400 font-semibold">red line</span> = Game Over.
            </li>
            <li>▶ Enter your final score.</li>
            <li>
              ▶ <span className="text-yellow-400 font-semibold">Screenshot mandatory</span>.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
