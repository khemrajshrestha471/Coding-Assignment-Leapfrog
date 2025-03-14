const express = require('express');
const pool = require("../../database/db");

const router = express.Router();

// Endpoint to check username, email, and phone
router.post('/check-user-existence', async (req, res) => {
    const { username, email, phone } = req.body;

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