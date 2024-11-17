import express from "express";
import { NerController } from "./ner.controller";
const router = express.Router();

router.post("/extract-data", NerController.extractData);

export const NerRoute = router;