import { and, eq } from "drizzle-orm";

//` File Imports
import { updateProfileValidation } from "../user.validation.js";
import { db } from "../../../db/index.ts";
import { users, sessions } from "../../../db/schema.ts";
import { getAccessToken } from "../../../utils/cookies.js";
import { verifyToken } from "../../../utils/jwtUtility.js";
import sendMail from "../../../utils/nodeMailer.js";

const updateProfile = async (req, res) => {
  const result = updateProfileValidation.safeParse(req.body);

  try {
    if (!result.success) {
      return res.status(400).json({
        message: "req.body validation failed",
        error: result.error.issues,
        data: null,
      });
    }

    const { name } = result.data;

    const { userId, sessionId } = req.user;

    // ` Checking if user exist
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: null,
        data: null,
      });
    }

    //` Variables
    const updateIsActive = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, userId));

    await sendMail(
      existingUser[0].email,
      "Your Profile Was Updated 🔄 | Hybrid Authentication",
      "Your profile information was successfully updated.",
      `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #111827; margin-bottom: 10px;">
        Profile Updated Successfully 🔄
      </h2>

      <p style="color: #374151; font-size: 15px;">
        Your profile information has been successfully updated in Hybrid Authentication.
      </p>

      <p style="color: #374151; font-size: 15px;">
        If you made this change, no further action is required.
      </p>

      <p style="color: #b91c1c; font-size: 14px; margin-top: 15px;">
        If you did not update your profile, please secure your account immediately by resetting your password.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 13px; color: #6b7280;">
        Keeping your account information accurate helps us maintain security.
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
      message: "Profile updated Successfully",
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

export default updateProfile;
