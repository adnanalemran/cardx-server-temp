// src/routes/card.route.ts
import express from "express";
import { BusnessCardController } from "./card.controller";
import createMulterUpload from "../../utils/multerUpload";
import { authenticate } from "../../middleware/authMiddleware";

const router = express.Router();
const upload = createMulterUpload("uploads/");

router.post("/cards", authenticate, upload.single("image"), BusnessCardController.CreateCard);
router.get("/cards", authenticate, BusnessCardController.getAllCard);
router.get("/cards/:id", authenticate, BusnessCardController.getSingleCard);
router.post("/cards/:id", authenticate, upload.single("image"), BusnessCardController.UpdateCard);
router.delete("/cards/:id", authenticate, BusnessCardController.DeleteCard);

export const BusnessCardRoute = router;
