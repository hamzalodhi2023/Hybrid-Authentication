import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//` Generate Token
export const generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET);

  return token;
};

//` Verify Token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
