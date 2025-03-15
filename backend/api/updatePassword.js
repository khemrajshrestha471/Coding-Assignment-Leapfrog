const express = require("express");
// const pool = require("../../database/db");
const pool = require('/app/database/db');

const router = express.Router();

const bcrypt = require("bcryptjs");

// PUT endpoint to update password
router.put("/resetPassword", async (req, res) => {
  const { username, email, phone, newPassword } = req.body;

  if (!username || !email || !phone || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Find the user by username, email, and phone
    const userQuery = `
      SELECT * FROM users 
      WHERE username = $1 AND email = $2 AND phone = $3
    `;
    const userResult = await pool.query(userQuery, [username, email, phone]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updateQuery = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, user.id]);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password." });
  }
});

module.exports = router;