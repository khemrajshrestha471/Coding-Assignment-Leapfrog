// const express = require("express");
// const bcrypt = require("bcryptjs");
// // const pool = require("../../database/db");
// const pool = require('/app/database/db');
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET

// router.post("/enter", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the user exists with the provided email
//     const userResult = await pool.query("SELECT id, username, email, password FROM users WHERE email = $1", [email]);

//     if (userResult.rows.length === 0) {
//       // User not found
//       return res.status(404).json({ error: "User with this email does not exist." });
//     }

//     const user = userResult.rows[0];

//     // Compare the provided password with the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       // Password is incorrect
//       return res.status(401).json({ error: "Invalid password." });
//     }

//     const token = jwt.sign(
//       { userId: user.id, username: user.username },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//         // Send token to client
//         res.cookie('token', token, {
//           httpOnly: true,
//           secure: process.env.SESSION_SECRET,
//           maxAge: 1 * 60 * 60 * 1000,
//         });

//     // Password is correct, return user data (excluding the password)
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//       },
//       token: token,
//     });

//   } catch (error) {
//     console.error("Error during login:", error); // Log the error
//     res.status(500).json({ error: error.message || "An unknown error occurred" });
//   }
// });

// module.exports = router;






const express = require("express");
const bcrypt = require("bcrypt");
const pool = require('/app/database/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * /api/login/enter:
 *   post:
 *     summary: Authenticate a user and generate a JWT token
 *     description: Authenticate a user by verifying their email and password. If successful, a JWT token is generated and returned.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             example:
 *               email: "lachipowdyel@gmail.com"
 *               password: "hgj657HJ^%"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the user.
 *                     username:
 *                       type: string
 *                       description: The username of the user.
 *                     email:
 *                       type: string
 *                       description: The email of the user.
 *                 token:
 *                   type: string
 *                   description: The JWT token for authenticated requests.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJ1c2VybmFtZSI6ImxhY2hoaSIsImlhdCI6MTc0MjA1NDk2MSwiZXhwIjoxNzQyMTQxMzYxfQ.LOLZDDs88Ur3FQw9STlwAL2-5T7uIHOOO3Y8Bnpl1Z0"
 *       401:
 *         description: Unauthorized. Invalid password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid password."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User with this email does not exist."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unknown error occurred"
 */
router.post("/enter", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists with the provided email
    const userResult = await pool.query("SELECT id, username, email, password FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      // User not found
      return res.status(404).json({ error: "User with this email does not exist." });
    }

    const user = userResult.rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Password is incorrect
      return res.status(401).json({ error: "Invalid password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set the token in a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Password is correct, return user data (excluding the password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token: token,
    });

  } catch (error) {
    console.error("Error during login:", error); // Log the error
    res.status(500).json({ error: error.message || "An unknown error occurred" });
  }
});

module.exports = router;