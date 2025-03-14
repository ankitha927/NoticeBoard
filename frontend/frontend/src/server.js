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
    console.error("❌ Database Connection Failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// User Registration
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const userRole = role === "admin" ? "admin" : "user";
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, userRole],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "✅ User registered successfully" });
    }
  );
});

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });

    res.json({ message: "✅ Login successful", token, role: user.role });
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
    
    const noticeId = result.insertId;
    res.json({ message: "✅ Notice added successfully", id: noticeId });

    // Auto-delete the notice after 2 minutes
    setTimeout(() => {
      db.query("DELETE FROM notices WHERE id = ?", [noticeId], (deleteErr) => {
        if (!deleteErr) console.log(`🗑️ Notice ID ${noticeId} deleted automatically after 2 minutes`);
      });
    }, 120000);
  });
});

// Delete a Notice Manually
app.delete("/notices/:id", (req, res) => {
  const noticeId = req.params.id;

  db.query("DELETE FROM notices WHERE id = ?", [noticeId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Notice not found" });

    res.json({ message: "✅ Notice deleted successfully" });
  });
});

// Clear All Notices (Only for Admin Use)
app.delete("/notices", (req, res) => {
  db.query("DELETE FROM notices", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "✅ All notices deleted successfully" });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
