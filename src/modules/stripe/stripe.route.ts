import express from "express";
import { StripeController } from "./stripe.controller";
const router = express.Router();

router.post("/create-subscription", StripeController.payment);

export const StripeRoute = router;