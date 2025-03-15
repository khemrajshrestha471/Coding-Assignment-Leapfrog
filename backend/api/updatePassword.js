const express = require("express");
const pool = require("../../database/db");
const bcrypt = require("bcrypt");

const router = express.Router();

/**
 * @swagger
 * /api/updatePassword/resetPassword:
 *   put:
 *     summary: Reset a user's password
 *     description: Reset a user's password by verifying their username, email, and phone number. The new password is hashed before being stored in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               phone:
 *                 type: string
 *                 description: The phone number of the user.
 *               newPassword:
 *                 type: string
 *                 description: The new password to set.
 *             example:
 *               username: "077bct020"
 *               email: "khemraj.077bct020@tcioe.edu.np"
 *               phone: "9825988766"
 *               newPassword: "hgj657HJ^%"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       400:
 *         description: Bad request. Missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error. Failed to update the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating password."
 */
router.put("/resetPassword", async (req, res) => {
  const { username, email, phone, newPassword } = req.body;

  // Validate input
  if (!username || !email || !phone || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Find the user by username, email, and phone
    const userQuery = `
      SELECT * FROM users 
      WHERE username = $1 AND email = $2 AND phone = $3
    `;
    const userResult = await pool.query(userQuery, [username, email, phone]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updateQuery = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, user.id]);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password." });
  }
});

module.exports = router;