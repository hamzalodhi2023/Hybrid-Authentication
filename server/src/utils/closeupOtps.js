import { db } from "../db/index.ts";
import { users, sessions, otpVerifications } from "../db/schema.ts";
import { and, eq } from "drizzle-orm";
const closeupOtps = async (userId) => {
  await db
    .update(otpVerifications)
    .set({ isUsed: true })
    .where(eq(otpVerifications.userId, userId));
};
export default closeupOtps;
