import crypto from "crypto";
import nodemailer from "nodemailer";
import Token from "../database/models/TokenModel.js";

const adminEmail = process.env.AdminEmail;
const adminPassword = process.env.AdminPassword;

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // Outlook SMTP server
  port: 587, // Outlook requires port 587
  secure: false,
  auth: {
    user: adminEmail,
    pass: adminPassword,
  },
  tls: {
    ciphers: "SSLv3", // Required for Outlook
  },
});

const hashToken = async (token) => {
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

const generateResetToken = async (userId) => {
  // Delete any existing tokens for this user
  await Token.deleteMany({ userId });

  // Generate token
  const token = crypto.randomBytes(64).toString("hex");

  // Set expiration (1 hour from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // Create and save token document
  await Token.create({
    userId,
    token,
    expiresAt,
  });

  return token;
};

const sendPasswordResetEmail = async (email, userName, url) => {
  const resetUrl = url;

  const mailOptions = {
    from: adminEmail,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hi ${userName},</h2>
        <p>You requested a password reset for your account. Please click the link below to reset your password:</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p><strong>This link expires at ${new Date(
          new Date().getTime() + 60 * 60 * 1000
        ).toLocaleString()}.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const emailVerification = async (email, token, userName) => {
  console.log("admin:", adminEmail, "adminpass:", adminPassword);
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: adminEmail,
    to: email,
    subject: "email verification from TaskManagers",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hi ${userName},</h2>
        <p>click the link  below to verify your email and login</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
       
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  try {
    console.log("message sent at:", info);
    return info;
  } catch (error) {
    console.log(error);
    throw new Error("email could not be sent");
  }
};

export {
  sendPasswordResetEmail,
  generateResetToken,
  hashToken,
  emailVerification,
};
