const express = require('express');
const pool = require("../../database/db");

const router = express.Router();

/**
 * @swagger
 * /api/checkUserEmailPhone/check-user-existence:
 *   post:
 *     summary: Check if a user exists with the provided username, email, and phone
 *     description: Verify if a user exists in the database with the provided username, email, and phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username to check.
 *               email:
 *                 type: string
 *                 description: The email to check.
 *               phone:
 *                 type: string
 *                 description: The phone number to check.
 *             example:
 *               username: "testuser"
 *               email: "testuser@example.com"
 *               phone: "1234567890"
 *     responses:
 *       200:
 *         description: User exists with the provided details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User exists with the provided username, email, and phone"
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "testuser"
 *                     email:
 *                       type: string
 *                       example: "testuser@example.com"
 *                     phone:
 *                       type: string
 *                       example: "1234567890"
 *       400:
 *         description: Bad request. Missing or invalid fields (username, email, or phone).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username is required and must be a valid string"
 *       404:
 *         description: No matching user found with the provided details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No matching user found with the provided details"
 *       500:
 *         description: Internal server error. Failed to check user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/check-user-existence', async (req, res) => {
  const { username, email, phone } = req.body;

  // Validate input
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ message: 'Username is required and must be a valid string' });
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({ message: 'Email is required and must be a valid string' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    return res.status(400).json({ message: 'Phone is required and must be a valid string' });
  }

  try {
    // Query the database to check if the username, email, and phone match
    const query = `
      SELECT username, email, phone
      FROM users
      WHERE username = $1 AND email = $2 AND phone = $3
    `;
    const result = await pool.query(query, [username, email, phone]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No matching user found with the provided details' });
    }

    const user = result.rows[0];

    // If username, email, and phone match
    return res.status(200).json({
      exists: true,
      message: 'User exists with the provided username, email, and phone',
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Error checking user details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;