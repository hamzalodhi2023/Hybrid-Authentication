import * as z from "zod";

export const loginValidation = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least 1 lowercase letter",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter",
    })
    .regex(/(?=.*[0-9])/, {
      message: "Password must contain at least 1 number",
    })
    .regex(/(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character (!@#$%^&*)",
    }),
});

export const registerValidation = loginValidation.extend({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),
});

export const otpValidation = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
