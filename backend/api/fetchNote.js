const express = require("express");
// const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database
const pool = require('/app/database/db');

const router = express.Router();

// GET /notes/:user_id - Fetch all notes for a specific user
router.get("/notes/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 2; // Default to 2 notes per page

    const offset = (page - 1) * limit; // Calculate the offset

    // Query 1: Count the total number of notes for the user
    const countQuery = await pool.query(
      `SELECT COUNT(*) FROM Notes WHERE user_id = $1`,
      [user_id]
    );
    const totalNotes = parseInt(countQuery.rows[0].count); // Extract the total count

    // Fetch notes from PostgreSQL
    const result = await pool.query(
      `SELECT * FROM Notes WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    // Send the fetched notes as the response
    res.status(200).json({
      notes: result.rows, // Paginated notes
      totalNotes: totalNotes, // Total number of notes
    });
  } catch (error) {
    console.error("Error fetching notes:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch notes" }); // Send a 500 error response
  }
});

module.exports = router;