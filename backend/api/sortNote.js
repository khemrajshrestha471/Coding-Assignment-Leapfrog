// const express = require("express");
// // const pool = require("../../database/db");
// const pool = require('/app/database/db');

// const router = express.Router();

// router.get("/sort-notes/:user_id", async (req, res) => {
//     try {
//       const { user_id } = req.params;
//       const { sortBy } = req.query;
  
//       // Validate user_id
//       if (!user_id) {
//         return res.status(400).json({ error: "user_id is required" });
//       }
  
//       // Define the sorting logic
//       let orderBy = "created_at DESC"; // Default sorting by creation date
//       if (sortBy === "updated_at") {
//         orderBy = "updated_at DESC";
//       } else if (sortBy === "title") {
//         orderBy = "title ASC";
//       }
  
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const offset = (page - 1) * limit;
  
//       // Fetch notes from PostgreSQL with sorting
//       const result = await pool.query(
//         `SELECT * FROM Notes WHERE user_id = $1 ORDER BY ${orderBy} LIMIT $2 OFFSET $3`,
//         [user_id, limit, offset]
//       );
  
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//       res.status(500).json({ error: "Failed to fetch notes" });
//     }
//   });

//   module.exports = router;





const express = require("express");
const pool = require('/app/database/db');

const router = express.Router();

/**
 * @swagger
 * /api/sortNote/sort-notes/{user_id}:
 *   get:
 *     summary: Fetch and sort notes for a specific user
 *     description: Fetch notes for a specific user and sort them by `created_at`, `updated_at`, or `title`. Pagination is supported.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose notes are to be fetched.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [created_at, updated_at, title]
 *         description: The field to sort the notes by. Default is `created_at`.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of notes per page.
 *     responses:
 *       200:
 *         description: A list of sorted notes.
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
 *                 - id: 29
 *                   user_id: 3
 *                   title: "This is title 111"
 *                   content: "This is content section"
 *                   created_at: "2025-03-15T15:33:58.000Z"
 *                   updated_at: "2025-03-15T15:33:58.000Z"
 *                 - id: 28
 *                   user_id: 3
 *                   title: "This is title"
 *                   content: "This is content section"
 *                   created_at: "2025-03-15T15:27:24.000Z"
 *                   updated_at: "2025-03-15T15:27:24.000Z"
 *       400:
 *         description: Bad request. Missing or invalid user_id.
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
router.get("/sort-notes/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { sortBy } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Define the sorting logic
    let orderBy = "created_at DESC"; // Default sorting by creation date
    if (sortBy === "updated_at") {
      orderBy = "updated_at DESC";
    } else if (sortBy === "title") {
      orderBy = "title ASC";
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch notes from PostgreSQL with sorting
    const result = await pool.query(
      `SELECT * FROM Notes WHERE user_id = $1 ORDER BY ${orderBy} LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

module.exports = router;