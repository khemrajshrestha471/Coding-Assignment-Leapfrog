// const express = require("express");
// // const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database
// const pool = require('/app/database/db');

// const router = express.Router();

// // DELETE /delete-note/:user_id/:note_id - Delete a specific note by user_id and note_id
// router.delete("/delete-note/:user_id/:note_id", async (req, res) => {
//   try {
//     const { user_id, note_id } = req.params; // Get user_id and note_id from the URL params

//     // Validate user_id and note_id
//     if (!user_id || !note_id) {
//       return res.status(400).json({ error: "user_id and note_id are required" });
//     }

//     // Delete the note from PostgreSQL
//     const result = await pool.query(
//       "DELETE FROM Notes WHERE user_id = $1 AND id = $2 RETURNING id, user_id, title, content",
//       [user_id, note_id]
//     );

//     // Check if the note was found and deleted
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Note not found or does not belong to the user" });
//     }

//     // Send the deleted note as the response
//     res.status(200).json({ message: "Note deleted successfully", deletedNote: result.rows[0] });
//   } catch (error) {
//     console.error("Error deleting note:", error); // Log the error
//     res.status(500).json({ error: "Failed to delete note" }); // Send a 500 error response
//   }
// });

// module.exports = router;






const express = require("express");
const pool = require('/app/database/db');

const router = express.Router();

/**
 * @swagger
 * /api/deleteNote/delete-note/{user_id}/{note_id}:
 *   delete:
 *     summary: Delete a specific note by user ID and note ID
 *     description: Delete a note from the database for a specific user by providing the user ID and note ID.
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
 *         description: The ID of the note to delete.
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note deleted successfully"
 *                 deletedNote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the deleted note.
 *                     user_id:
 *                       type: integer
 *                       description: The ID of the user who owned the note.
 *                     title:
 *                       type: string
 *                       description: The title of the deleted note.
 *                     content:
 *                       type: string
 *                       description: The content of the deleted note.
 *                   example:
 *                     id: 14
 *                     user_id: 4
 *                     title: "eee"
 *                     content: "eee"
 *       400:
 *         description: Bad request. Missing or invalid user_id or note_id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "user_id and note_id are required"
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
 *         description: Internal server error. Failed to delete the note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete note"
 */
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