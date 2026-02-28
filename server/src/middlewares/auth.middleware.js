import { and, eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "../utils/cookies.js";
import { generateToken, verifyToken } from "../utils/jwtUtility.js";
import { users, sessions } from "../db/schema.ts";
import location from "../utils/locationFinder.js";
import { verifyPassword } from "../utils/hashPassword.js";
const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = verifyToken(getAccessToken(req));
    const refreshToken = verifyToken(getRefreshToken(req));

    if (!refreshToken.valid) {
      return res.redirect("https://youtube.com/");
    }

    const isSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, refreshToken.decoded.sessionId));

    if (!isSession[0]) {
      return res.redirect("https://youtube.com/");
    }

    const compareRefreshToken = await verifyPassword(
      getRefreshToken(req),
      isSession[0].token,
    );

    if (!compareRefreshToken) {
      return res.redirect("https://youtube.com/");
    }

    if (isSession[0].userId !== refreshToken.decoded.userId) {
      return res.redirect("https://youtube.com/");
    }

    const { ipAddress, userAgent, device, browser, os } = location(req);

    if (
      isSession[0].ipAddress !== ipAddress ||
      isSession[0].userAgent !== userAgent ||
      isSession[0].device !== device ||
      isSession[0].browser !== browser ||
      isSession[0].os !== os
    ) {
      return res.redirect("https://youtube.com/");
    }

    const sessionId = Math.floor(Math.random() * 1e15)
      .toString()
      .padStart(15, "0");

    const newAccessToken = generateToken(
      { userId: isSession[0].userId, sessionId: isSession[0].id },
      "1m",
    );

    req.user = {
      userId: isSession[0].userId,
      sessionId: isSession[0].id,
    };

    setAccessToken(res, newAccessToken);

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error, data: null });
  }
};

export default authMiddleware;
