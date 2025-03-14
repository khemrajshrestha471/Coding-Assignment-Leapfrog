const express = require("express");
const pool = require("../../database/db");
const bcrypt = require("bcrypt");

const router = express.Router();

// PUT endpoint to change password
router.put("/change-password/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Validate input
  if (!user_id || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "user_id, oldPassword, and newPassword are required." });
  }

  try {
    // Find the user by user_id
    const userQuery = `
      SELECT * FROM users 
      WHERE id = $1
    `;
    const userResult = await pool.query(userQuery, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updateQuery = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, user_id]);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password." });
  }
});

module.exports = router;