
require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vanitharamu@123", // Change if your MySQL has a password
  database: "noticeboard",
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// User Registration
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "User registered successfully" });
    }
  );
});

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: results[0].id }, "secret_key", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  });
});

// Fetch Notices
app.get("/notices", (req, res) => {
  db.query("SELECT * FROM notices ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Add Notice
app.post("/notices", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Missing fields" });

  db.query("INSERT INTO notices (title, content) VALUES (?, ?)", [title, content], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Notice added successfully" });
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
