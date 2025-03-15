const express = require("express");
// const pool = require("../../database/db");
const pool = require('/app/database/db');

const router = express.Router();

// Search notes by title or content
router.get("/search-notes/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { query } = req.query; // Search query (title or content)

    // Validate user_id and query
    if (!user_id || !query) {
      return res.status(400).json({ error: "user_id and query are required" });
    }

    // Fetch notes that match the search query
    const result = await pool.query(
      `SELECT * FROM Notes 
       WHERE user_id = $1 
       AND (title ILIKE $2 OR content ILIKE $2) 
       ORDER BY created_at DESC`,
      [user_id, `%${query}%`] // Use ILIKE for case-insensitive search
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching notes:", error);
    res.status(500).json({ error: "Failed to search notes" });
  }
});

module.exports = router;