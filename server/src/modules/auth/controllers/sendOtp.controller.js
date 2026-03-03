import { randomUUID } from "node:crypto";
import { db } from "../../../db/index.ts";
import { otpVerifications, users } from "../../../db/schema.ts";
import closeupOtps from "../../../utils/closeupOtps.js";
import { and, eq } from "drizzle-orm";
import generateOTP from "../../../utils/generateOtp.js";
import { hashPassword } from "../../../utils/hashPassword.js";
import location from "../../../utils/locationFinder.js";
import sendMail from "../../../utils/nodeMailer.js";

const sendOtp = async (req, res) => {
  const { userId, sessionId } = req.user;
  const { ipAddress, userAgent, device, browser, os } = location(req);

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser.length === 0) {
      return res.redirect("https://youtube.com/");
    }

    closeupOtps(userId);

    const isVerified = existingUser[0].isVerified;
    const otp = generateOTP();
    const otpHash = await hashPassword(otp);
    const otpTTL = 5 * 60 * 1000;

    const expiresAt = new Date(Date.now() + otpTTL);

    const createOtp = await db.insert(otpVerifications).values({
      id: randomUUID(),
      userId,
      otpHash,
      expiresAt,
      ipAddress,
      userAgent,
      device,
      browser,
      os,
    });

    await sendMail(
      existingUser[0].email,
      "Your OTP for Hybrid Authentication 🔐",
      `Use the following OTP to complete your login: ${otp}`, // short text fallback
      `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #111827; margin-bottom: 10px;">
        Hybrid Authentication 🔐
      </h2>

      <p style="color: #374151; font-size: 15px;">
        A new login to your account was detected.
      </p>

      <p style="color: #374151; font-size: 15px;">
        Use the following OTP to complete your login:
      </p>

      <h1 style="color: #111827; font-size: 28px; letter-spacing: 2px; margin: 20px 0;">
        ${otp}
      </h1>

      <p style="color: #374151; font-size: 14px;">
        This OTP will expire in 5 minutes.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 13px; color: #6b7280;">
        If you did not attempt to login, please reset your password immediately.
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
      message: "OTP send Successfully",
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
export default sendOtp;
