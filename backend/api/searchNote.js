const express = require("express");
const pool = require("../../database/db");

const router = express.Router();

/**
 * @swagger
 * /api/searchNote/search-notes/{user_id}:
 *   get:
 *     summary: Search notes by title or content for a specific user
 *     description: Search notes for a specific user by providing a search query. The search is case-insensitive and matches both the title and content of the notes.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose notes are to be searched.
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query to match against note titles or content.
 *     responses:
 *       200:
 *         description: A list of notes matching the search query.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the note.
 *                   user_id:
 *                     type: integer
 *                     description: The ID of the user who owns the note.
 *                   title:
 *                     type: string
 *                     description: The title of the note.
 *                   content:
 *                     type: string
 *                     description: The content of the note.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the note was created.
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the note was last updated.
 *               example:
 *                 - id: 12
 *                   user_id: 3
 *                   title: "Quick Reminders"
 *                   content: "Save important dates, deadlines, or random thoughts that you need to remember later."
 *                   created_at: "2025-03-13T02:30:00.000Z"
 *                   updated_at: "2025-03-13T02:30:00.000Z"
 *                 - id: 8
 *                   user_id: 3
 *                   title: "Daily Tasks"
 *                   content: "List down important tasks for the day. Prioritize them for better productivity."
 *                   created_at: "2025-03-13T02:29:08.000Z"
 *                   updated_at: "2025-03-13T02:29:08.000Z"
 *       400:
 *         description: Bad request. Missing or invalid user_id or query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "user_id and query are required"
 *       500:
 *         description: Internal server error. Failed to search notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to search notes"
 */
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