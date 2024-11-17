// src/routes/user.route.ts
import express from "express";
import { UserController } from "./user.controller";
import createMulterUpload from "../../utils/multerUpload";

const router = express.Router();
const upload = createMulterUpload("uploads/");

router.post(
  "/registration",
  upload.single("profileImage"),
  UserController.Registration
);

router.post("/login", UserController.Login);
router.get("/profileInfo", UserController.getProfileInfo);
router.post("/profileUpdate", UserController.updateProfile);

export const UserRoute = router;
