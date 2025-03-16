const express = require("express");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

/**
 * @swagger
 * /api/fetchNote/notes/{user_id}:
 *   get:
 *     summary: Fetch paginated notes for a specific user
 *     description: Retrieve a paginated list of notes for a given user ID, sorted by creation date in descending order.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose notes are to be fetched.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 2
 *         description: The number of notes per page (default is 2).
 *     responses:
 *       200:
 *         description: A paginated list of notes and the total number of notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique ID of the note.
 *                       user_id:
 *                         type: integer
 *                         description: The ID of the user who created the note.
 *                       title:
 *                         type: string
 *                         description: The title of the note.
 *                       content:
 *                         type: string
 *                         description: The content of the note.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the note was created.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the note was last updated.
 *                 totalNotes:
 *                   type: integer
 *                   description: The total number of notes for the user.
 *       400:
 *         description: Bad request. The `user_id` parameter is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "user_id is required"
 *       500:
 *         description: Internal server error. Failed to fetch notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch notes"
 */
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