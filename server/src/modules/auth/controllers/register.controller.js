//` File Imports
import { registerValidation } from "../auth.validation.js";
import { db } from "../../../db/index.ts";
import { users } from "../../../db/schema.ts";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../../utils/hashPassword.js";

const register = async (req, res) => {
  try {
    const result = registerValidation.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "req.body validation failed",
        error: result.error.issues,
        data: null,
      });
    }

    const { name, email, password } = result.data;

    //` Checking If User Already Exist
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
        error: null,
        data: null,
      });
    }

    //` Hashed Password
    const hashed = await hashPassword(password);

    const insertData = await db
      .insert(users)
      .values({ name, email, password: hashed });

    // ! End response
    res.status(201).json({
      message: "User created Successfully",
      error: null,
      data: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error, data: null });
  }
};

export default register;
