import { and, eq } from "drizzle-orm";

//` File Imports
import { updateProfileValidation } from "../user.validation.js";
import { db } from "../../../db/index.ts";
import { users, sessions } from "../../../db/schema.ts";
import { getAccessToken } from "../../../utils/cookies.js";
import { verifyToken } from "../../../utils/jwtUtility.js";

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
