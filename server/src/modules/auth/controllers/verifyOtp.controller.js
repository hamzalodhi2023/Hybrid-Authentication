import { verifyPassword } from "../../../utils/hashPassword.js";
import { otpValidation } from "../auth.validation.js";
import { and, eq } from "drizzle-orm";
import { db } from "../../../db/index.ts";
import { users, sessions, otpVerifications } from "../../../db/schema.ts";
import closeupOtps from "../../../utils/closeupOtps.js";

const verifyOtp = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = otpValidation.safeParse(req.body);

    if (!result.success) {
      return res.status(401).json({
        message: "Invalid or expired OTP",
        error: result.error.issues,
        data: null,
      });
    }

    const otp = result.data.otp;

    //` FINDING USER
    const otpData = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.userId, userId),
          eq(otpVerifications.isUsed, false),
        ),
      )
      .limit(1);

    if (!otpData[0]) {
      return res.status(401).json({
        message: "Invalid or expired OTP",
        error: null,
        data: null,
      });
    }

    console.log(otpData);

    if (new Date() > otpData[0].expiresAt) {
      await db
        .update(otpVerifications)
        .set({ isUsed: true })
        .where(eq(otpVerifications.id, otpData[0].id));

      return res.status(401).json({
        message: "Invalid or expired OTP",
        error: null,
        data: null,
      });
    }
    const isOtpValid = await verifyPassword(otp, otpData[0].otpHash);

    if (!isOtpValid) {
      return res.status(401).json({
        message: "Invalid or expired OTP",
        error: null,
        data: null,
      });
    }

    await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userId));

    closeupOtps(userId);

    // ! End response
    res.status(200).json({
      message: "User verified Successfully",
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

export default verifyOtp;
