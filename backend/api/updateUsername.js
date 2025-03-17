// const express = require("express");
// // const pool = require("../../database/db"); // Import the database pool
// const pool = require('/app/database/db');

// const router = express.Router();

// // PUT /update-username/:user_id - Update username
// router.put("/update-username/:user_id", async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const { username } = req.body;

//     // Validate input
//     if (!username) {
//       return res.status(400).json({ error: "Username is required" });
//     }

//     // Update username in the database
//     const result = await pool.query(
//       `UPDATE Users SET username = $1 WHERE id = $2 RETURNING *`,
//       [username, user_id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Send the updated user data as the response
//     res.status(200).json({ user: result.rows[0] });
//   } catch (error) {
//     console.error("Error updating username:", error);
//     res.status(500).json({ error: "Failed to update username" });
//   }
// });

// module.exports = router;






const express = require("express");
const pool = require('/app/database/db');

const router = express.Router();

/**
 * @swagger
 * /api/updateUsername/update-username/{user_id}:
 *   put:
 *     summary: Update a user's username
 *     description: Update the username of a specific user by providing their user ID and the new username.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose username is to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username.
 *             example:
 *               username: "modified_user"
 *     responses:
 *       200:
 *         description: Username updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the user.
 *                     username:
 *                       type: string
 *                       description: The updated username.
 *                     email:
 *                       type: string
 *                       description: The email of the user.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the user.
 *                     password:
 *                       type: string
 *                       description: The hashed password of the user.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the user was created.
 *                   example:
 *                     id: 1
 *                     username: "modified_user"
 *                     email: "testuser@example.com"
 *                     phone: "1234567890"
 *                     password: "$2b$10$TX3UFwQpsqAI3vCDM6n46uvPZAwHvlP/a.zyVWg8tS3i5w4BCwf1K"
 *                     created_at: "2025-03-11T21:46:47.704Z"
 *       400:
 *         description: Bad request. Missing or invalid username.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username is required"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error. Failed to update the username.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update username"
 */
router.put("/update-username/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Update username in the database
    const result = await pool.query(
      `UPDATE Users SET username = $1 WHERE id = $2 RETURNING *`,
      [username, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the updated user data as the response
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Failed to update username" });
  }
});

module.exports = router;