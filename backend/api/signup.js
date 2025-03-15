const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../../database/db"); // Importing the pool for the connection to the postgres database

const router = express.Router();

/**
 * @swagger
 * /api/signup/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user by providing a username, email, phone, and password. The password is hashed before being stored in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *               email:
 *                 type: string
 *                 description: The email of the new user.
 *               phone:
 *                 type: string
 *                 description: The phone number of the new user.
 *               password:
 *                 type: string
 *                 description: The password of the new user.
 *             example:
 *               username: "test"
 *               email: "test@gmail.com"
 *               phone: "9812345678"
 *               password: "dshHJGH%*^^65"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly registered user.
 *                 username:
 *                   type: string
 *                   description: The username of the new user.
 *                 email:
 *                   type: string
 *                   description: The email of the new user.
 *                 phone:
 *                   type: string
 *                   description: The phone number of the new user.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the user was created.
 *               example:
 *                 id: 23
 *                 username: "test"
 *                 email: "test@gmail.com"
 *                 phone: "9812345678"
 *                 created_at: "2025-03-15T10:32:01.974Z"
 *       400:
 *         description: Bad request. Username, email, or phone already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username, email, or phone already exists."
 *       500:
 *         description: Internal server error. Failed to register the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unknown error occurred"
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const newUser = await pool.query(
      "INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email, phone, created_at",
      [username, email, phone, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]); // Return the inserted user details (excluding password)
  } catch (error) {
    console.error("Error during registration:", error); // Log the error
    if (error.code === "23505") {
      res.status(400).json({ error: "Username, email, or phone already exists." });
    } else {
      res.status(500).json({ error: error.message || "An unknown error occurred" });
    }
  }
});

module.exports = router;