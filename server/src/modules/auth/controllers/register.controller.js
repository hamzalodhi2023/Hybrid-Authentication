//` File Imports
import { registerValidation } from "../auth.validation.js";
import { db } from "../../../db/index.ts";
import { users } from "../../../db/schema.ts";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../../utils/hashPassword.js";
import sendMail from "../../../utils/nodeMailer.js";

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

    await sendMail(
      email,
      "Welcome to Hybrid Authentication 🚀",
      "Your account has been successfully created.",
      `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      
      <h2 style="color: #111827; margin-bottom: 10px;">
        Welcome to Hybrid Authentication 🔐
      </h2>

      <p style="color: #374151; font-size: 15px;">
        Your account has been successfully created.
      </p>

      <p style="color: #374151; font-size: 15px;">
        You can now securely log in and start using all available features.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 13px; color: #6b7280;">
        If you did not create this account, please ignore this email.
      </p>

      <p style="font-size: 13px; color: #9ca3af; margin-top: 20px;">
        © ${new Date().getFullYear()} Hybrid Authentication. All rights reserved.
      </p>

    </div>
  </div>
  `,
    );

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
