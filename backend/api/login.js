const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../../database/db");

const router = express.Router();

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

    // Password is correct, return user data (excluding the password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error during login:", error); // Log the error
    res.status(500).json({ error: error.message || "An unknown error occurred" });
  }
});

module.exports = router;
