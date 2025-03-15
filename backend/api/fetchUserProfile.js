const express = require("express");
// const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database
const pool = require('/app/database/db');
const router = express.Router();

// GET /users/:user_id - Fetch user details by user_id
router.get("/fetch-users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Fetch user details from PostgreSQL
    const result = await pool.query(
      `SELECT username, email, phone, password, created_at FROM Users WHERE id = $1`,
      [user_id]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the fetched user details as the response
    res.status(200).json({
      user: result.rows[0], // User details
    });
  } catch (error) {
    console.error("Error fetching user details:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch user details" }); // Send a 500 error response
  }
});

module.exports = router;