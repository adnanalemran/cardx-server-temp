import express from "express";
import path from 'path';
import multer from "multer";
import { AzureExtractInfo } from "./extract.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 

router.post("/extract-card-data", upload.single("businessCard"), AzureExtractInfo.extractData);

export const AzureExtractRoute = router;