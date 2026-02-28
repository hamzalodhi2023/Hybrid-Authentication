import { and, eq } from "drizzle-orm";
import { randomInt } from "node:crypto";

//` File Imports
import { loginValidation } from "../auth.validation.js";
import { db } from "../../../db/index.ts";
import { users, sessions } from "../../../db/schema.ts";
import { hashPassword, verifyPassword } from "../../../utils/hashPassword.js";
import { generateToken } from "../../../utils/jwtUtility.js";
import location from "../../../utils/locationFinder.js";
import { setRefreshToken, setAccessToken } from "../../../utils/cookies.js";
import sendMail from "../../../utils/nodeMailer.js";

const login = async (req, res) => {
  const result = loginValidation.safeParse(req.body);

  try {
    if (!result.success) {
      return res.status(400).json({
        message: "req.body validation failed",
        error: result.error.issues,
        data: null,
      });
    }

    const { email, password } = result.data;

    // ` Checking if user exist
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: null,
        data: null,
      });
    }

    // ` Checking if password correct
    const userPass = existingUser[0].password;
    const userId = existingUser[0].id;
    const isValid = await verifyPassword(password, userPass);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: null,
        data: null,
      });
    }

    //` Variables
    const sessionId = Math.floor(Math.random() * 1e15)
      .toString()
      .padStart(15, "0");
    const jwtRefreshToken = generateToken({ userId, sessionId }, "7d");
    const refreshToken = await hashPassword(jwtRefreshToken);
    const accessToken = generateToken({ userId, sessionId }, "1m");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const { ipAddress, userAgent, device, browser, os } = location(req);

    const updateIsActive = await db
      .update(sessions)
      .set({ isActive: false, revokedAt: new Date() })
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.ipAddress, ipAddress),
          eq(sessions.userAgent, userAgent),
          eq(sessions.isActive, true),
        ),
      );

    //` Creating Session
    const insertData = await db.insert(sessions).values({
      id: sessionId,
      userId,
      token: refreshToken,
      ipAddress,
      userAgent,
      device,
      browser,
      os,
      expiresAt,
      lastUsedAt: new Date(),
    });

    setRefreshToken(res, jwtRefreshToken);
    setAccessToken(res, accessToken);

    await sendMail(
      email,
      "New Login to Your Hybrid Authentication Account 🔐",
      "A new login was detected on your account.",
      `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #111827; margin-bottom: 10px;">
        New Login Detected 🔐
      </h2>

      <p style="color: #374151; font-size: 15px;">
        We noticed a new login to your Hybrid Authentication account.
      </p>

      <p style="color: #374151; font-size: 15px;">
        If this was you, no action is needed.
      </p>

      <p style="color: #b91c1c; font-size: 14px; margin-top: 15px;">
        If this wasn't you, please reset your password immediately and secure your account.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 13px; color: #6b7280;">
        For your security, we recommend keeping your login credentials private.
      </p>

      <p style="font-size: 13px; color: #9ca3af; margin-top: 20px;">
        © ${new Date().getFullYear()} Hybrid Authentication. All rights reserved.
      </p>

    </div>
  </div>
  `,
    );

    // ! End response
    res.status(200).json({
      message: "User logged in Successfully",
      error: null,
      data: null,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error, data: null });
  }
};

export default login;
