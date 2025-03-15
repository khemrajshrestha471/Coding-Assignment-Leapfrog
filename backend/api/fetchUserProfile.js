const express = require("express");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

/**
 * @swagger
 * /api/fetchUserProfile/fetch-users/{user_id}:
 *   get:
 *     summary: Fetch user details by user ID
 *     description: Retrieve user details (username, email, phone, password, and created_at) for a specific user by providing their user ID.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose details are to be fetched.
 *     responses:
 *       200:
 *         description: User details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: The username of the user.
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
 *                     username: "Khemraj"
 *                     email: "check@gmail.com"
 *                     phone: "9800009999"
 *                     password: "$2b$10$l/W0dDxOSfI4NvUYEJFgJ.0.XS1hnctz2M1eMTM7pXV0NBdocgDxm"
 *                     created_at: "2025-03-12T10:44:08.356Z"
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
 *         description: Internal server error. Failed to fetch user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch user details"
 */
router.get("/fetch-users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Fetch user details from PostgreSQL
    const result = await pool.query(
      `SELECT username, email, phone, password, created_at FROM Users WHERE id = $1`,
      [user_id]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the fetched user details as the response
    res.status(200).json({
      user: result.rows[0], // User details
    });
  } catch (error) {
    console.error("Error fetching user details:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch user details" }); // Send a 500 error response
  }
});

module.exports = router;