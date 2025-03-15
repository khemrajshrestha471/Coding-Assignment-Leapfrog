const express = require("express");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

/**
 * @swagger
 * /api/addNote/add-note:
 *   post:
 *     summary: Add a new note
 *     description: Add a new note for a specific user with the provided title and content. The creation and update timestamps are automatically set to the current time in the Asia/Kathmandu (NPT) time zone.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user adding the note.
 *               title:
 *                 type: string
 *                 description: The title of the note.
 *               content:
 *                 type: string
 *                 description: The content of the note.
 *             example:
 *               user_id: 3
 *               title: "This is title"
 *               content: "This is content section"
 *     responses:
 *       201:
 *         description: Note added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique ID of the newly added note.
 *                 user_id:
 *                   type: integer
 *                   description: The ID of the user who added the note.
 *                 title:
 *                   type: string
 *                   description: The title of the note.
 *                 content:
 *                   type: string
 *                   description: The content of the note.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the note was created (in Asia/Kathmandu time zone).
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the note was last updated (in Asia/Kathmandu time zone).
 *               example:
 *                 id: 28
 *                 user_id: 3
 *                 title: "This is title"
 *                 content: "This is content section"
 *                 created_at: "2025-03-15T15:27:24.000Z"
 *                 updated_at: "2025-03-15T15:27:24.000Z"
 *       400:
 *         description: Bad request. Missing required fields (user_id, title, or content).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "user_id, title, and content are required"
 *       500:
 *         description: Internal server error. Failed to add the note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to add note"
 */
router.post("/add-note", async (req, res) => {
  try {
    const { user_id, title, content } = req.body;

    // Validate required fields
    if (!user_id || !title || !content) {
      return res.status(400).json({ error: "user_id, title, and content are required" });
    }

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