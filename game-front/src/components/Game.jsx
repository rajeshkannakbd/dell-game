import { useState } from "react";

export default function Game() {
  const [points, setPoints] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!points || !screenshot) {
      alert("Please enter points and upload a screenshot!");
      return;
    }

    // ✅ FIX: read user properly
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.email) {
      alert("User not logged in. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("points", points);
    formData.append("screenshot", screenshot);
    formData.append("game", "game1");
    formData.append("email", user.email); // ✅ correct email

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/submit-score", {
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

      <h1 className="text-4xl font-extrabold text-sky-400 mb-8">
        🎯 Catch the Drops
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center">

        {/* Game */}
        <div className="bg-slate-950 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
          <iframe
            src="https://scratch.mit.edu/projects/1261098010/embed"
            width="485"
            height="402"
            className="rounded-xl border-2 border-sky-400"
            allowTransparency="true"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title="Catch the Drops"
          />

          {/* Inputs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="number"
              placeholder="Enter your points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="px-4 py-2 w-44 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-sky-400"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
              className="text-slate-300 file:bg-sky-400 file:text-slate-900 file:rounded-lg file:px-4 file:py-2 file:border-0 cursor-pointer"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-sky-400 text-slate-900 font-semibold hover:bg-sky-500 transition"
            >
              {loading ? "Sending..." : "Send 🚀"}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-900 rounded-2xl shadow-xl p-6 w-full max-w-sm text-slate-200">
          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            📜 Instructions
          </h2>

          <ul className="list-disc list-inside space-y-3">
            <li>Click the <span className="text-green-400 font-semibold">green flag</span> to start.</li>
            <li>Catch the falling drops to score.</li>
            <li>You have <span className="text-yellow-400 font-semibold">3 lives</span>.</li>
            <li>Each miss reduces <span className="text-red-400 font-semibold">1 life</span>.</li>
            <li>Use <span className="font-semibold">arrow keys</span> to move.</li>
            <li>Enter your final score.</li>
            <li className="text-red-400 font-semibold">Screenshot is mandatory.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
