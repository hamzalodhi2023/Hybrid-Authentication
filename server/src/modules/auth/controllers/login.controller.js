//` File Imports
import { loginValidation } from "../auth.validation.js";
import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { verifyPassword } from "../../../utils/hashPassword.js";
import { generateToken } from "../../../utils/jwtUtility.js";

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

    //` Generating Token
    const token = generateToken(userId);
    console.log(token);

    // ! End response
    res.status(200).json({
      message: "User logged in Successfully",
      error: null,
      data: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error, data: null });
  }
};

export default login;
