const express = require("express");
const pool = require("../../database/db"); // Import the database pool

const router = express.Router();

// PUT /update-username/:user_id - Update username
router.put("/update-username/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Update username in the database
    const result = await pool.query(
      `UPDATE Users SET username = $1 WHERE id = $2 RETURNING *`,
      [username, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the updated user data as the response
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Failed to update username" });
  }
});

module.exports = router;