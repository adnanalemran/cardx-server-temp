import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "wQuzduOQ2KcHvx/xw5yCrjmc7wIjKDwakAzPDtbLoAc=";

// Extend the Request interface
interface AuthRequest extends Request {
  userId?: number; // optional, as it may not be set if authentication fails
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" }); // Send response and return
    return; // Ensure you exit after sending the response
  }

  const token = authHeader.split(" ")[1];

  console.log(token);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    console.log("from decode",decoded);
    req.userId = decoded.userId; // Set userId on request object
    next(); // Call next to pass control to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" }); // Send response for error
    return; // Ensure you exit after sending the response
  }
};
