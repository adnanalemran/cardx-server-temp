import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { verifyToken } from "../../utils/auth";
import { hashPassword, generateToken, verifyPassword } from "../../utils/auth";
import { empty } from "@prisma/client/runtime/library";
import multer from "multer";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const generateRefCode = async (): Promise<string> => {
  let refCode: string = "";
  let isUnique = false;

  while (!isUnique) {
    refCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // Example: "X8G2Y7RZ"
    const existingUser = await prisma.user.findUnique({ where: { refCode } });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return refCode;
};
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Registration = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    let profileImageUrl: string | null = null;

    if (req.file) {
      profileImageUrl = `/uploads/${req.file.filename}`;
    }

    const hashedPassword = await hashPassword(password);
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    const refCode = await generateRefCode();

    const tenant = await prisma.tenant.create({
      data: {
        name,
        email,
        users: {
          create: {
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            freeTrial: true,
            trialEndDate,
            remainingCards: 50,
            profileImage: profileImageUrl,
            refCode,
          },
        },
      },
      include: { users: true },
    });

    const user = tenant.users[0];
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user.id);

    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword,
      token,
    });
    console.log("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User could not be created" });
  }
});
const Login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Remove the password before returning the user
    const { password: _, ...userWithoutPassword } = user;

    const token = generateToken(user.id);
    res.json({ message: "Login successful", user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});
const getProfileInfo = catchAsync(async (req: Request, res: Response) => {
  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token); // Decodes and validates JWT
    console.log("Decoded Token:", decoded);

    let userId: string | undefined;
    if (typeof decoded !== "string" && "userId" in decoded) {
      userId = decoded.userId;
    } // Adjusted to match your token structure
    if (!userId) {
      return res.status(400).json({ error: "Invalid token" });
    }

    console.log("userId:", userId);

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }, // Use valid unique identifier
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        freeTrial: true,
        trialEndDate: true,
        remainingCards: true,
        refCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile information retrieved", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve profile information" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store files
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s+/g, "_");
    const timestamp = Date.now();
    cb(null, `${timestamp}_${originalName}`);
  },
});

const upload = multer({ storage });

const deleteOldImage = (filePath: string) => {
  const fullPath = path.join(__dirname, "../../../", filePath); // Adjust based on your directory structure
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
      else console.log(`Old image deleted: ${filePath}`);
    });
  }
};

const updateProfile = [
  upload.single("profileImage"),
  catchAsync(async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      let userId: string | undefined;
      if (typeof decoded !== "string" && "userId" in decoded) {
        userId = decoded.userId;
      }
      if (!userId) {
        return res.status(400).json({ error: "Invalid token" });
      }

      const { name, email, phoneNumber } = req.body;

      console.log("Body received:", req.body);
      console.log("File received:", req.file);

      // Fetch the current user data
      const currentUser = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      let profileImageUrl: string | null = null;

      if (req.file) {
        // Delete the old profile image if it exists
        if (currentUser.profileImage) {
          deleteOldImage(currentUser.profileImage);
        }

        profileImageUrl = `/uploads/${req.file.filename}`;
      }

      if (email && !isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Update the user's profile in the database
      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }),
          ...(profileImageUrl && { profileImage: profileImageUrl }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
          freeTrial: true,
          trialEndDate: true,
          remainingCards: true,
          refCode: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not update profile" });
    }
  }),
];

export const UserController = {
  Registration,
  Login,
  getProfileInfo,
  updateProfile,
};
