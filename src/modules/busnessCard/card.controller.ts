// src/controllers/card.controller.ts
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import path from "path";

const prisma = new PrismaClient();

const CreateCard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId; // Get the authenticated user ID
  const { email, companyName, designation, name, mobileNumber, address, phoneNumbers } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let image = null;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  const card = await prisma.card.create({
    data: {
      email,
      companyName,
      designation,
      name,
      mobileNumber,
      address,
      image,
      user: { connect: { id: userId } }, 
      phoneNumbers: {
        create: phoneNumbers.map((number: string) => ({
          number,
        })),
      },
    },
    include: { phoneNumbers: true },
  });

  res.status(201).json({ message: "Card created successfully", card });
});

const getAllCard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId; 
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const cards = await prisma.card.findMany({
        where: { userId },
        include: { phoneNumbers: true }
    });

    res.status(200).json(cards);
});

const getSingleCard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId; 
    const { id } = req.params;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const card = await prisma.card.findFirst({
        where: { id: Number(id), userId },
        include: { phoneNumbers: true }
    });

    if (!card) {
        return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(card);
});

const UpdateCard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId; 
    const { id } = req.params;
    const { email, companyName, designation, name, mobileNumber, address, phoneNumbers } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    let imageUrl = undefined;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedCard = await prisma.card.update({
        where: { id: Number(id), userId },
        data: {
            email,
            companyName,
            designation,
            name,
            mobileNumber,
            address,
            ...(imageUrl && { image: imageUrl }),
            phoneNumbers: {
                deleteMany: {},
                create: phoneNumbers ? JSON.parse(phoneNumbers).map((number: string) => ({ number })) : [],
            }
        }
    });

    res.status(200).json({ message: "Card updated successfully", card: updatedCard });
});

const DeleteCard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const del = await prisma.card.deleteMany({
        where: { id: Number(id), userId }
    });

    console.log(
        `Deleted ${del} card`
    );

    res.status(200).json({ message: "Card deleted successfully" });
});

export const BusnessCardController = {
    CreateCard,
    getAllCard,
    getSingleCard,
    UpdateCard,
    DeleteCard
};
