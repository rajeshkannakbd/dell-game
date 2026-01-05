import { useEffect, useState } from "react";

const API = "https://dell-game-lingesh-server.onrender.com";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedShot, setSelectedShot] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch users ---------------- */
  useEffect(() => {
    fetch(`${API}/admin/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
        setLoading(false);
      });
  }, []);

  /* ---------------- Ranking ---------------- */
  const rankedUsers = [...users]
    .map((u) => ({
      ...u,
      total:
        (u.game1?.score || 0) +
        (u.game2?.score || 0) +
        (u.game3?.score || 0) +
        (u.game4?.score || 0),
    }))
    .sort((a, b) => b.total - a.total);

  /* ---------------- Edit score ---------------- */
  const updateScore = (userIndex, gameKey, value) => {
    const updated = [...users];
    updated[userIndex][gameKey].score = Number(value) || 0;
    setUsers(updated);
    setEditing(null);
  };

  const ScoreCell = ({ user, userIndex, gameKey, label }) => (
    <td className="px-4 py-2 text-center">
      <div className="flex justify-center items-center gap-2">
        {editing === `${userIndex}-${gameKey}` ? (
          <input
            type="number"
            defaultValue={user[gameKey]?.score || 0}
            autoFocus
            onBlur={(e) =>
              updateScore(userIndex, gameKey, e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              updateScore(userIndex, gameKey, e.target.value)
            }
            className="w-16 px-2 py-1 rounded bg-slate-800 text-white text-center border border-sky-400"
          />
        ) : (
          <span
            onClick={() =>
              setEditing(`${userIndex}-${gameKey}`)
            }
            className="cursor-pointer hover:text-sky-400 font-medium"
          >
            {user[gameKey]?.score || 0}
          </span>
        )}

        {user[gameKey]?.screenshot && (
          <button
            onClick={() =>
              setSelectedShot({
                name: user.name || "Unknown User",
                game: label,
                image: `${API}/uploads/${user[gameKey].screenshot
                  .replace(/^uploads[\\/]/, "")
                }`,
              })
            }
            className="text-sky-400 hover:text-sky-300"
            title="View Screenshot"
          >
            👁
          </button>
        )}
      </div>
    </td>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Loading admin data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-6 py-8 text-white">
      <h1 className="text-4xl font-extrabold text-sky-400 mb-8 text-center">
        🛠 Admin Dashboard
      </h1>

      {/* Users Table */}
      <div className="overflow-x-auto bg-slate-950 rounded-2xl shadow-xl mb-10">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-sky-400">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Game 1</th>
              <th className="px-4 py-3 text-center">Game 2</th>
              <th className="px-4 py-3 text-center">Game 3</th>
              <th className="px-4 py-3 text-center">Game 4</th>
              <th className="px-4 py-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {rankedUsers.map((u, i) => (
              <tr
                key={u._id}
                className="border-t border-slate-800 hover:bg-slate-900"
              >
                <td className="px-4 py-2 font-medium">
                  {u.name || "Unknown User"}
                </td>

                <td className="px-4 py-2 text-slate-300">
                  {u.email || "—"}
                </td>

                <ScoreCell user={u} userIndex={i} gameKey="game1" label="Game 1" />
                <ScoreCell user={u} userIndex={i} gameKey="game2" label="Game 2" />
                <ScoreCell user={u} userIndex={i} gameKey="game3" label="Game 3" />
                <ScoreCell user={u} userIndex={i} gameKey="game4" label="Game 4" />

                <td className="px-4 py-2 text-center font-bold">
                  {u.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leaderboard */}
      <h2 className="text-3xl font-bold text-sky-400 mb-4 text-center">
        🏆 Leaderboard
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {rankedUsers.slice(0, 3).map((u, index) => {
          let bg = "bg-slate-900";
          if (index === 0) bg = "bg-yellow-500 text-slate-900";
          if (index === 1) bg = "bg-gray-300 text-slate-900";
          if (index === 2) bg = "bg-amber-700 text-white";

          return (
            <div
              key={u._id}
              className={`${bg} rounded-xl p-4 flex justify-between items-center shadow-lg`}
            >
              <div className="font-semibold">
                #{index + 1} {u.name || "Unknown User"}
              </div>
              <div className="font-bold">{u.total} pts</div>
            </div>
          );
        })}
      </div>

      {/* Screenshot Modal */}
      {selectedShot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setSelectedShot(null)}
              className="absolute top-3 right-4 text-xl text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-sky-400 mb-2">
              {selectedShot.name} — {selectedShot.game}
            </h3>

            <img
              src={selectedShot.image}
              alt="Game Screenshot"
              className="rounded-lg border border-slate-700 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
