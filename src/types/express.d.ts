// src/@types/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number; // Optional property to store user ID
    }
  }
}
