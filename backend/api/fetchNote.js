const express = require("express");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

// GET /notes/:user_id - Fetch all notes for a specific user
router.get("/notes/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Fetch notes from PostgreSQL
    const notes = await pool.query("SELECT * FROM Notes WHERE user_id = $1", [
      user_id,
    ]);

    // Send the fetched notes as the response
    res.status(200).json(notes.rows);
  } catch (error) {
    console.error("Error fetching notes:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch notes" }); // Send a 500 error response
  }
});

module.exports = router;