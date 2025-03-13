const express = require("express");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

router.post("/add-note", async (req, res) => {
  try {
    const { user_id, title, content } = req.body;

    // Get the current timestamp in Asia/Kathmandu (NPT) time zone
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" });

    // Insert notes into PostgreSQL with explicit time zone conversion
    const newNote = await pool.query(
      `INSERT INTO Notes (user_id, title, content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, content, created_at, updated_at`,
      [user_id, title, content, now, now]
    );

    res.status(201).json(newNote.rows[0]);
  } catch (error) {
    console.error("Error adding Notes:", error); // Log the error
    res.status(500).json({ error: "Failed to add note" }); // Send a 500 error response
  }
});

module.exports = router;