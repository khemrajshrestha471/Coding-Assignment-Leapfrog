const express = require("express");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

// DELETE /delete-note/:user_id/:note_id - Delete a specific note by user_id and note_id
router.delete("/delete-note/:user_id/:note_id", async (req, res) => {
  try {
    const { user_id, note_id } = req.params; // Get user_id and note_id from the URL params

    // Validate user_id and note_id
    if (!user_id || !note_id) {
      return res.status(400).json({ error: "user_id and note_id are required" });
    }

    // Delete the note from PostgreSQL
    const result = await pool.query(
      "DELETE FROM Notes WHERE user_id = $1 AND id = $2 RETURNING id, user_id, title, content",
      [user_id, note_id]
    );

    // Check if the note was found and deleted
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found or does not belong to the user" });
    }

    // Send the deleted note as the response
    res.status(200).json({ message: "Note deleted successfully", deletedNote: result.rows[0] });
  } catch (error) {
    console.error("Error deleting note:", error); // Log the error
    res.status(500).json({ error: "Failed to delete note" }); // Send a 500 error response
  }
});

module.exports = router;