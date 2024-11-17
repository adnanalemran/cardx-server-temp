import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "wQuzduOQ2KcHvx/xw5yCrjmc7wIjKDwakAzPDtbLoAc=";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "10h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
