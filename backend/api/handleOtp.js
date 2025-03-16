const express = require("express");
const nodemailer = require("nodemailer");
const validator = require("validator");

const router = express.Router();

const OTPStore = {}; // In-memory store for OTPs

/**
 * @swagger
 * /api/handleOtp/send-otp:
 *   post:
 *     summary: Send OTP to the provided email
 *     description: Generate a 6-digit OTP and send it to the provided email address for verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to which the OTP will be sent.
 *             example:
 *               email: "khemraj.077bct020@tcioe.edu.np"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "OTP sent successfully"
 *       400:
 *         description: Bad request. Invalid email address.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Invalid email address"
 *       500:
 *         description: Internal server error. Failed to send OTP.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Failed to send OTP"
 */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email address");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save OTP to in-memory store for verification
  OTPStore[email] = otp;

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Configure email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for Note Taking Application",
    text: `Your OTP is ${otp} for verification. Do not share your OTP with others.`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    res.status(500).send("Failed to send OTP");
  }
});

/**
 * @swagger
 * /api/handleOtp/verify-otp:
 *   post:
 *     summary: Verify the OTP
 *     description: Verify the OTP provided by the user against the OTP stored in memory.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address associated with the OTP.
 *               otp:
 *                 type: string
 *                 description: The OTP to verify.
 *             example:
 *               email: "khemraj.077bct020@tcioe.edu.np"
 *               otp: "618499"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "OTP verified"
 *       400:
 *         description: Bad request. Invalid OTP.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Invalid OTP"
 */
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // Ensure OTP is stored as a string for comparison
  if (OTPStore[email] && OTPStore[email].toString() === otp) {
    delete OTPStore[email]; // Remove OTP after verification
    res.status(200).send("OTP verified");
  } else {
    res.status(400).send("Invalid OTP");
  }
});

module.exports = router;