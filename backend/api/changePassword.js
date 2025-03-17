// const express = require("express");
// // const pool = require("../../database/db");
// const pool = require('/app/database/db');
// const bcrypt = require("bcryptjs");

// const router = express.Router();

// // PUT endpoint to change password
// router.put("/change-password/:user_id", async (req, res) => {
//   const { user_id } = req.params;
//   const { oldPassword, newPassword } = req.body;

//   // Validate input
//   if (!user_id || !oldPassword || !newPassword) {
//     return res.status(400).json({ error: "user_id, oldPassword, and newPassword are required." });
//   }

//   try {
//     // Find the user by user_id
//     const userQuery = `
//       SELECT * FROM users 
//       WHERE id = $1
//     `;
//     const userResult = await pool.query(userQuery, [user_id]);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const user = userResult.rows[0];

//     // Verify the old password
//     const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Incorrect old password." });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user's password
//     const updateQuery = `
//       UPDATE users 
//       SET password = $1 
//       WHERE id = $2
//     `;
//     await pool.query(updateQuery, [hashedPassword, user_id]);

//     res.status(200).json({ message: "Password updated successfully." });
//   } catch (error) {
//     console.error("Error changing password:", error);
//     res.status(500).json({ message: "Error changing password." });
//   }
// });

// module.exports = router;





const express = require("express");
const pool = require('/app/database/db');
const bcrypt = require("bcrypt");

const router = express.Router();

/**
 * @swagger
 * /api/changePassword/change-password/{user_id}:
 *   put:
 *     summary: Change a user's password
 *     description: Change the password for a specific user after verifying the old password.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose password is to be changed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's current password.
 *               newPassword:
 *                 type: string
 *                 description: The new password to set.
 *             example:
 *               oldPassword: "hgj657HJ^%"
 *               newPassword: "dfhs&^%^kkHJ12"
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
 *         description: Bad request. Missing required fields (user_id, oldPassword, or newPassword).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "user_id, oldPassword, and newPassword are required."
 *       401:
 *         description: Unauthorized. Incorrect old password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect old password."
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
 *         description: Internal server error. Failed to change the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error changing password."
 */
router.put("/change-password/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Validate input
  if (!user_id || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "user_id, oldPassword, and newPassword are required." });
  }

  try {
    // Find the user by user_id
    const userQuery = `
      SELECT * FROM users 
      WHERE id = $1
    `;
    const userResult = await pool.query(userQuery, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updateQuery = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, user_id]);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password." });
  }
});

module.exports = router;