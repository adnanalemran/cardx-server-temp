"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureExtractInfo = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const analysis_1 = require("./analysis");
const fs_1 = __importDefault(require("fs"));
// Controller function to handle the request
const extractData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file); // Log the uploaded file information
    if (!req.file) {
        res.status(400).send("Please upload a business card image.");
        return;
    }
    try {
        // Analyze the business card
        const result = yield (0, analysis_1.analyzeBusinessCard)(req.file.path);
        console.log("Azure result", result); // Logs extracted fields
        // Send response with the analyzed data
        res.status(200).json({ businessCard: result });
    }
    catch (error) {
        console.error("Error analyzing business card:", error);
        res.status(500).send("Error processing the business card.");
    }
    finally {
        // Delete the uploaded file after processing, regardless of success or failure
        fs_1.default.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Failed to delete the file:", err);
            }
            else {
                console.log("File deleted successfully:");
            }
        });
    }
}));
exports.AzureExtractInfo = {
    extractData
};
