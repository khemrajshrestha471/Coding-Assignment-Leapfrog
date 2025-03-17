// const express = require("express");
// // const pool = require("../../database/db");
// const pool = require('/app/database/db');
// const moment = require("moment-timezone");

// const router = express.Router();

// router.put("/update-note/:user_id/:note_id", async (req, res) => {
//   try {
//     const { user_id, note_id } = req.params;
//     const { title, content } = req.body;

//     // Validate that at least one field (title or content) is provided for update
//     if (!title && !content) {
//       return res.status(400).json({ error: "At least one field (title or content) is required for update" });
//     }

//     // Construct the SQL query dynamically based on the fields provided
//     let query = "UPDATE Notes SET ";
//     const values = [];
//     let paramIndex = 1;

//     if (title) {
//       query += `title = $${paramIndex}, `;
//       values.push(title);
//       paramIndex++;
//     }

//     if (content) {
//       query += `content = $${paramIndex}, `;
//       values.push(content);
//       paramIndex++;
//     }

//     // Get the current time in Asia/Kathmandu (NPT)
//     const updatedAt = moment().tz("Asia/Kathmandu").format("YYYY-MM-DD HH:mm:ss");

//     // Add updated_at with the local time
//     query += `updated_at = $${paramIndex} `;
//     values.push(updatedAt);

//     // Add the WHERE clause
//     query += `WHERE user_id = $${paramIndex + 1} AND id = $${paramIndex + 2} RETURNING id, user_id, title, content, created_at, updated_at`;
//     values.push(user_id, note_id);

//     // Execute the update query
//     const updatedNote = await pool.query(query, values);

//     // Check if the note was found and updated
//     if (updatedNote.rows.length === 0) {
//       return res.status(404).json({ error: "Note not found or does not belong to the user" });
//     }

//     // Send the updated note as the response
//     res.status(200).json(updatedNote.rows[0]);
//   } catch (error) {
//     console.error("Error updating note:", error);
//     res.status(500).json({ error: "Failed to update note" });
//   }
// });

// module.exports = router;





const express = require("express");
const pool = require('/app/database/db');
const moment = require("moment-timezone");

const router = express.Router();

/**
 * @swagger
 * /api/updateNote/update-note/{user_id}/{note_id}:
 *   put:
 *     summary: Update a note by user ID and note ID
 *     description: Update the title and/or content of a specific note for a user. The `updated_at` field is automatically set to the current time in the Asia/Kathmandu (NPT) time zone.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user who owns the note.
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the note to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the note.
 *               content:
 *                 type: string
 *                 description: The new content of the note.
 *             example:
 *               title: "Updated title"
 *               content: "Updated Content"
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated note.
 *                 user_id:
 *                   type: integer
 *                   description: The ID of the user who owns the note.
 *                 title:
 *                   type: string
 *                   description: The updated title of the note.
 *                 content:
 *                   type: string
 *                   description: The updated content of the note.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the note was created.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the note was last updated.
 *               example:
 *                 id: 29
 *                 user_id: 3
 *                 title: "Updated title"
 *                 content: "Updated Content"
 *                 created_at: "2025-03-15T15:33:58.000Z"
 *                 updated_at: "2025-03-15T16:26:13.000Z"
 *       400:
 *         description: Bad request. Missing or invalid fields (title or content).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "At least one field (title or content) is required for update"
 *       404:
 *         description: Note not found or does not belong to the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Note not found or does not belong to the user"
 *       500:
 *         description: Internal server error. Failed to update the note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update note"
 */
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