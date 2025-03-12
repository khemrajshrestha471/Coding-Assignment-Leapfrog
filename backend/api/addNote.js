const express = require("express");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

router.post("/add-note", async (req, res) => {
  try {
    const { user_id, title, content } = req.body;

    // Insert notes into PostgreSQL
    const newNote = await pool.query(
      "INSERT INTO Notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, user_id, title, content, created_at, updated_at",
      [user_id, title, content]
    );

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error adding Notes:", error);  // Log the error
  }
});

module.exports = router;
