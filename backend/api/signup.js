const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const newUser = await pool.query(
      "INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email, phone, created_at",
      [username, email, phone, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]); // Return the inserted user details (excluding password)
  } catch (error) {
    console.error("Error during registration:", error);  // Log the error
    if (error.code === "23505") {
      res.status(400).json({ error: "Username, email, or phone already exists." });
    } else {
      res.status(500).json({ error: error.message || "An unknown error occurred" });
    }
  }
});

module.exports = router;
