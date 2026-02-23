import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

//` Hash Password
export const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

//` Verify Password
export const verifyPassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};
