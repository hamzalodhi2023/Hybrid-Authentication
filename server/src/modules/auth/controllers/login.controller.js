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
    const refreshToken = await hashPassword(
      generateToken({ userId, sessionId }, "7d"),
    );
    const accessToken = generateToken({ userId, sessionId }, "15m");
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

    setRefreshToken({ res, refreshToken });
    setAccessToken({ res, accessToken });

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
