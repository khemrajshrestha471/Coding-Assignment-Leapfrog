const express = require("express");
const pool = require("../../database/db"); // Ensure this is your PostgreSQL pool

const router = express.Router();

/**
 * @swagger
 * /api/checkExistence/check-existence:
 *   post:
 *     summary: Check if email or phone already exists
 *     description: Check if the provided email or phone number already exists in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email to check.
 *               phone:
 *                 type: string
 *                 description: The phone number to check.
 *             example:
 *               email: "testuser1@example.com"
 *               phone: "9800009999"
 *     responses:
 *       200:
 *         description: Email and phone are available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and phone are available."
 *       400:
 *         description: Bad request. Email or phone already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already exists."
 *       500:
 *         description: Internal server error. Failed to check existence.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post("/check-existence", async (req, res) => {
  const { email, phone } = req.body;

  try {
    // Check if email exists
    const emailQuery = "SELECT * FROM users WHERE email = $1";
    const emailResult = await pool.query(emailQuery, [email]);

    if (emailResult.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Check if phone exists
    const phoneQuery = "SELECT * FROM users WHERE phone = $1";
    const phoneResult = await pool.query(phoneQuery, [phone]);

    if (phoneResult.rows.length > 0) {
      return res.status(400).json({ message: "Phone number already exists." });
    }

    // If neither exists, return success
    res.status(200).json({ message: "Email and phone are available." });
  } catch (error) {
    console.error("Error checking existence:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;