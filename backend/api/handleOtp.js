const express = require("express");

const router = express.Router();
const nodemailer = require("nodemailer");
const validator = require("validator");

const OTPStore = {};

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).send("Invalid email address");
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  
    // Save OTP to in-memory store for verification
    OTPStore[email] = otp;
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for Note Taking Application",
      text: `Your OTP is ${otp} for verification. Do not share your OTP with others.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send("OTP sent successfully");
    } catch (error) {
      res.status(500).send("Failed to send OTP");
    }
  });


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