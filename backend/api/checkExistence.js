const express = require("express");
// const pool = require("../../database/db"); // Ensure this is your PostgreSQL pool
const pool = require('/app/database/db');

const router = express.Router();

router.post("/check-existence", async (req, res) => {
  const { email, phone } = req.body;

  try {
    // Check if email exists
    const emailQuery = "SELECT * FROM users WHERE email = $1";
    const emailResult = await pool.query(emailQuery, [email]);

    if (emailResult.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Check if phone exists
    const phoneQuery = "SELECT * FROM users WHERE phone = $1";
    const phoneResult = await pool.query(phoneQuery, [phone]);

    if (phoneResult.rows.length > 0) {
      return res.status(400).json({ message: "Phone number already exists." });
    }

    // If neither exists, return success
    res.status(200).json({ message: "Email and phone are available." });
  } catch (error) {
    console.error("Error checking existence:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;