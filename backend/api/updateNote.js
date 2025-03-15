const express = require("express");
// const pool = require("../../database/db");
const pool = require('/app/database/db');
const moment = require("moment-timezone");

const router = express.Router();

router.put("/update-note/:user_id/:note_id", async (req, res) => {
  try {
    const { user_id, note_id } = req.params;
    const { title, content } = req.body;

    // Validate that at least one field (title or content) is provided for update
    if (!title && !content) {
      return res.status(400).json({ error: "At least one field (title or content) is required for update" });
    }

    // Construct the SQL query dynamically based on the fields provided
    let query = "UPDATE Notes SET ";
    const values = [];
    let paramIndex = 1;

    if (title) {
      query += `title = $${paramIndex}, `;
      values.push(title);
      paramIndex++;
    }

    if (content) {
      query += `content = $${paramIndex}, `;
      values.push(content);
      paramIndex++;
    }

    // Get the current time in Asia/Kathmandu (NPT)
    const updatedAt = moment().tz("Asia/Kathmandu").format("YYYY-MM-DD HH:mm:ss");

    // Add updated_at with the local time
    query += `updated_at = $${paramIndex} `;
    values.push(updatedAt);

    // Add the WHERE clause
    query += `WHERE user_id = $${paramIndex + 1} AND id = $${paramIndex + 2} RETURNING id, user_id, title, content, created_at, updated_at`;
    values.push(user_id, note_id);

    // Execute the update query
    const updatedNote = await pool.query(query, values);

    // Check if the note was found and updated
    if (updatedNote.rows.length === 0) {
      return res.status(404).json({ error: "Note not found or does not belong to the user" });
    }

    // Send the updated note as the response
    res.status(200).json(updatedNote.rows[0]);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

module.exports = router;