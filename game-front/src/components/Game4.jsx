import { useState } from "react";

const API = "http://localhost:5000"; // backend URL

export default function Game4() {
  const [points, setPoints] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Get logged-in user's email
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const handleSubmit = async () => {
    if (!points || !screenshot) {
      alert("Points and screenshot are mandatory!");
      return;
    }

    if (!email) {
      alert("User not logged in. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("points", points);
      formData.append("email", email);
      formData.append("game", "game4");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center px-4 py-8">
      
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-sky-400 mb-8 tracking-wide">
        🎯 Balloon Shooter
      </h1>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center">

        {/* Game Card */}
        <div className="bg-slate-950 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
          <iframe
            src="https://scratch.mit.edu/projects/1261497456/embed"
            allowTransparency="true"
            width="485"
            height="402"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            className="rounded-lg border-2 border-sky-400"
            title="Balloon Shooter"
          />

          {/* Score + Upload */}
          <div className="mt-6 w-full space-y-4">
            <input
              type="number"
              placeholder="Enter your points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
              className="w-full text-slate-300 file:bg-sky-400 file:text-slate-900 file:font-semibold file:px-4 file:py-2 file:rounded-lg file:border-0 cursor-pointer"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-6 py-2 rounded-lg bg-sky-400 text-slate-900 font-semibold hover:bg-sky-500 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Send 🚀"}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-900 rounded-2xl shadow-xl p-6 w-full max-w-sm text-slate-200">
          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            📜 Instructions
          </h2>

          <ul className="list-disc list-inside space-y-3 text-base">
            <li>Click the <span className="text-green-400 font-semibold">green flag</span> to start.</li>
            <li>Shoot balloons to score points.</li>
            <li>You have <span className="text-yellow-400 font-semibold">30 seconds</span>.</li>
            <li>Shoot as many balloons as possible.</li>
            <li className="flex gap-2">
              <span className="text-yellow-400 font-bold">▶</span>
              Use <span className="bg-slate-800 px-2 py-0.5 rounded font-semibold">mouse click</span> to shoot.
            </li>
            <li>After game ends, enter your final score.</li>
            <li className="text-red-400 font-semibold">Screenshot is mandatory.</li>
            <li>Upload screenshot and submit.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
