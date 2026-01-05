const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://dell-game-lingesh-server.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- MongoDB ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error(err));

/* ---------------- Schema ---------------- */
const gameSchema = new mongoose.Schema(
  {
    score: { type: Number, default: 0 },
    screenshot: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    game1: gameSchema,
    game2: gameSchema,
    game3: gameSchema,
    game4: gameSchema,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/* ---------------- Multer ---------------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ---------------- Routes ---------------- */

// Test
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: "Name & email required" });

    if (!email.endsWith("@dell.com"))
      return res.status(403).json({ message: "Only @dell.com allowed" });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        game1: {},
        game2: {},
        game3: {},
        game4: {},
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit Score
app.post(
  "/api/submit-score",
  upload.single("screenshot"),
  async (req, res) => {
    try {
      const { points, email, game } = req.body;

      if (!points || !email || !game)
        return res.status(400).json({ message: "Missing fields" });

      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User not found" });

      await User.updateOne(
        { email },
        {
          $set: {
            [`${game}.score`]: Number(points),
            [`${game}.screenshot`]: req.file
              ? req.file.path.replace(/\\/g, "/")
              : "",
          },
        }
      );

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }
);

// Admin
app.get("/admin/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Leaderboard
app.get("/leaderboard", async (req, res) => {
  const users = await User.find();

  const ranked = users
    .map((u) => ({
      name: u.name,
      email: u.email,
      total:
        (u.game1?.score || 0) +
        (u.game2?.score || 0) +
        (u.game3?.score || 0) +
        (u.game4?.score || 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  res.json(ranked);
});

/* ---------------- Start ---------------- */
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on ${PORT} 🚀`)
);
